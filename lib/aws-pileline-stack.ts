import * as cdk from "@aws-cdk/core";
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction, GitHubTrigger, CodeBuildAction, CodeBuildActionType, } from '@aws-cdk/aws-codepipeline-actions';
import { BuildSpec, PipelineProject } from '@aws-cdk/aws-codebuild';
import { AnyPrincipal, Effect, Policy, PolicyStatement, Role } from "@aws-cdk/aws-iam";
import { SlackChannelConfiguration } from "@aws-cdk/aws-chatbot";
import { NotificationRule } from "@aws-cdk/aws-codestarnotifications";
import { Topic } from '@aws-cdk/aws-sns';

//Initiate a new Pipeline Stack to be Formed in the 'AWC CloudFormation'
export class MyPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, stackId: string,) {
    super(scope, stackId);

    /*--------------------Pipeline Block--------------------*/

    //Create Artifacts for the Actions Outputs
    const sourceArtifact = new Artifact('SourceArtifact');
    const buildArtifact = new Artifact('BuildArtifact');

    //Source Pipeline Stage
    //Set new GitHub Action connection (version 1)
    let gitHubSourceAction = new GitHubSourceAction({
      actionName: "github",
      owner: "Nikita1917s",
      repo: "KeyUA-Pipeline-Prototype",
      branch: 'main',
      oauthToken: cdk.SecretValue.secretsManager('GITHUB_OAUTH_TOKEN_TESTING'),
      output: sourceArtifact,
      trigger: GitHubTrigger.WEBHOOK,
    });

    //Set a new Codebuild Role for a PipelineProject
    const testCodebuildRole = new Role(this, 'project-role', {
      assumedBy: new AnyPrincipal()
    })
    const testCodebuildPolicy = new Policy(this, 'project-policy', {
      statements: [new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["ecr:*"],
        resources: ["*"]
      })]
    });
    testCodebuildPolicy.attachToRole(testCodebuildRole)

    //Initiate a new CloudFormation Stack --> PipelineProject that will be build
    let project = new PipelineProject(this, 'MyPipelineStackProject', {
      projectName: `MyPipelineStackProject`,
      buildSpec: BuildSpec.fromSourceFilename('buildspec.yml'),
      role: testCodebuildRole,
      environment: {
        privileged: true
      }
    });

    //Build Pipeline Stage
    let codeBuildAction = new CodeBuildAction({
      actionName: "codebuild",
      input: sourceArtifact,
      outputs: [buildArtifact],
      project: project,
      type: CodeBuildActionType.BUILD
    });

    //Create Pipeline Instace
    const pipeline = new Pipeline(this, 'MyFirstPipeline', {
      pipelineName: 'MyPipeline',
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
    const slackChannel = new SlackChannelConfiguration(this, 'pipeline-slack', {
      slackChannelConfigurationName: 'pipeline-deploy',
      //slackWorkspaceId can be taken from 'AWS Chatbot' --> 'Slack workspace' Client
      slackWorkspaceId: 'TG1K2568N',
      //slackWorkspaceId can be taken from 'Slack App' --> 'Slack Channel details'
      slackChannelId: 'C031Z1KJH6C',
    });

    //Create a new SNS Topic for Slack notifications
    const topic = new Topic(this, 'PipelineTopic');

    //Events for notification rules on pipelines to be tracked 
    const PIPELINE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-pipeline-execution-succeeded';
    const PIPELINE_EXECUTION_FAILED = 'codepipeline-pipeline-pipeline-execution-failed';

    //Set Up Notification Rules to track changes on the Pipeline
    new NotificationRule(this, 'NotificationRule', {
      notificationRuleName: `${pipeline.pipelineName}-pipeline-result`,
      source: pipeline,
      events: [
        PIPELINE_EXECUTION_SUCCEEDED,
        PIPELINE_EXECUTION_FAILED
      ],
      targets: [topic, slackChannel],
    });
  }
}