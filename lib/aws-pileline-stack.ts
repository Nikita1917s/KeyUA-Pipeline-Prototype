import * as cdk from 'aws-cdk-lib';

//Set StackProps data types
export interface StackProps extends cdk.StackProps {
  owner: string,
  repo: string,
  branch: string,
  oauthToken: string,
  projectName: string,
  pipelineName: string,
  slackWorkspaceId: string,
  slackChannelId: string
}

//Initiate a new Pipeline Stack to be Formed in the 'AWC CloudFormation'
export class newPipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, stackId: string, props: StackProps) {
    super(scope, stackId, props);

    /*--------------------Pipeline Block--------------------*/

    //Create Artifacts for the Actions Outputs
    const sourceArtifact = new cdk.aws_codepipeline.Artifact('SourceArtifact');
    const buildArtifact = new cdk.aws_codepipeline.Artifact('BuildArtifact');

    //Source Pipeline Stage
    //Set new GitHub Action connection (version 1)
    let gitHubSourceAction = new cdk.aws_codepipeline_actions.GitHubSourceAction({
      actionName: "github",
      owner: props.owner,
      repo: props.repo,
      branch: props.branch,
      oauthToken: cdk.SecretValue.secretsManager(props.oauthToken),
      output: sourceArtifact,
      //trigger: cdk.GitHubTrigger.WEBHOOK,
    });

    //Set a new Codebuild Role for a PipelineProject
    const testCodebuildRole = new cdk.aws_iam.Role(this, 'project-role', {
      assumedBy: new cdk.aws_iam.AnyPrincipal()
    })
    const testCodebuildPolicy = new cdk.aws_iam.Policy(this, 'project-policy', {
      statements: [new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ["ecr:*"],
        resources: ["*"]
      })]
    });
    testCodebuildPolicy.attachToRole(testCodebuildRole)

    //Initiate a new CloudFormation Stack --> PipelineProject that will be build
    let project = new cdk.aws_codebuild.PipelineProject(this, props.projectName, {
      projectName: props.projectName,
      buildSpec: cdk.aws_codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
      role: testCodebuildRole,
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
          actions: [gitHubSourceAction]
        },
        {
          stageName: "Build",
          actions: [codeBuildAction]
        }]
    });


    /*--------------------Slack Notifications Block--------------------*/

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
  }
}