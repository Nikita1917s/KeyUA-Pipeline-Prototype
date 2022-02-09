import * as cdk from 'aws-cdk-lib';
import { ConnectionType } from '../helpers/connection-type';


//Set StackProps data types
export interface StackProps extends cdk.StackProps {
  actionName: string,
  owner: string,
  repo: string,
  branch: string,
  projectName: string,
  pipelineName: string,
  slackNotifications: boolean,
  slackWorkspaceId: string,
  slackChannelId: string,
  connectionArn: string
};

//Initiate a new Pipeline Stack to be Formed in the 'AWC CloudFormation'
export class newPipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, stackId: string, props: StackProps) {
    super(scope, stackId, props);

    /*--------------------Pipeline Block--------------------*/

    //Create Artifacts for the Actions Outputs
    const sourceArtifact = new cdk.aws_codepipeline.Artifact('SourceArtifact');
    const buildArtifact = new cdk.aws_codepipeline.Artifact('BuildArtifact');

    //Source Pipeline Stage
    //codecommitRepository is used for CodeCommitSource type
    const codecommitRepository = cdk.aws_codecommit.Repository.fromRepositoryName(this, props.repo, props.repo)

    //Get right Repository connection type (another file used)
    let sourceAction = ConnectionType({
      actionName: props.actionName,
      owner: props.owner,
      repo: props.repo,
      branch: props.branch,
      connectionArn: props.connectionArn,
      codecommitRepository: codecommitRepository
    })

    //Set a new Codebuild Role for a PipelineProject
    const codebuildRole = new cdk.aws_iam.Role(this, 'project-role', {
      assumedBy: new cdk.aws_iam.AnyPrincipal()
    });
    const codebuildPolicy = new cdk.aws_iam.Policy(this, 'project-policy', {
      statements: [new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ["ecr:*"],
        resources: ["*"]
      })]
    });
    codebuildPolicy.attachToRole(codebuildRole);

    //Initiate a new CloudFormation Stack --> PipelineProject that will be build
    let project = new cdk.aws_codebuild.PipelineProject(this, props.projectName, {
      projectName: props.projectName,
      buildSpec: cdk.aws_codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
      role: codebuildRole,
      environment: {
        privileged: true
      }
    });

    //Build Pipeline Stage
    let codeBuildAction = new cdk.aws_codepipeline_actions.CodeBuildAction({
      actionName: "codebuild",
      input: sourceArtifact,
      outputs: [buildArtifact],
      project: project,
      type: cdk.aws_codepipeline_actions.CodeBuildActionType.BUILD
    });

    //Create Pipeline Instace
    const pipeline = new cdk.aws_codepipeline.Pipeline(this, props.pipelineName, {
      pipelineName: props.pipelineName,
      stages: [
        {
          stageName: "Source",
          actions: [sourceAction]
        },
        {
          stageName: "Build",
          actions: [codeBuildAction]
        }]
    });

    /*--------------------Slack Notifications Block--------------------*/

    //Create Slack Notifications on request
    if (props.slackNotifications) {

      //Configure slackChannel notifications
      const slackChannel = new cdk.aws_chatbot.SlackChannelConfiguration(this, 'pipeline-slack', {
        slackChannelConfigurationName: 'pipeline-deploy',
        //slackWorkspaceId can be taken from 'AWS Chatbot' --> 'Slack workspace' Client
        slackWorkspaceId: props.slackWorkspaceId,
        //slackWorkspaceId can be taken from 'Slack App' --> 'Slack Channel details'
        slackChannelId: props.slackChannelId,
      });

      //Create a new SNS Topic for Slack notifications
      const topic = new cdk.aws_sns.Topic(this, 'PipelineTopic');

      //Events for notification rules on pipelines to be tracked 
      const PIPELINE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-pipeline-execution-succeeded';
      const PIPELINE_EXECUTION_FAILED = 'codepipeline-pipeline-pipeline-execution-failed';

      //Set Up Notification Rules to track changes on the Pipeline
      new cdk.aws_codestarnotifications.NotificationRule(this, 'NotificationRule', {
        notificationRuleName: `${props.pipelineName}-pipeline-result`,
        source: pipeline,
        events: [
          PIPELINE_EXECUTION_SUCCEEDED,
          PIPELINE_EXECUTION_FAILED
        ],
        targets: [topic, slackChannel],
      });
    };
  };
};