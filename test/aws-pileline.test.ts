import { Template } from "aws-cdk-lib/assertions";
import { App } from "aws-cdk-lib";
import { newPipelineStack } from "../lib/aws-pileline-stack";

const app = new App();

let PipelineProps = {
    //Select right actionName: (CodeStarConnectionsSource / CodeCommitSource)
    actionName: "CodeCommitSource",
    connectionArn: "arn:aws:codestar-connections:us-east-1:123456789102:connection/1aa1a111-1111-1111-1111-1aa111a11a1a",
    owner: "owner",
    repo: "repo",
    branch: "main",
    projectName: "projectName",
    pipelineName: "pipelineName",
    slackNotifications: true,
    slackWorkspaceId: "AA1A1111A",
    slackChannelId: "AA11A1AAA1A"
};

// Create the ProcessorStack
const processorStack = new newPipelineStack(app, 'New--PipelineStack', PipelineProps);

// Prepare the stack for assertions
const template = Template.fromStack(processorStack);

describe("PipelineStack creation", () => {
    test("Source Stage", () => {

        template.hasResourceProperties("AWS::CodePipeline::Pipeline", {
            "Stages": [
                {
                    "Actions": [
                        {
                            "ActionTypeId": {
                                "Category": "Source",
                                "Owner": "AWS",
                                "Provider": "CodeCommit"
                            },
                            "Configuration": {
                                "RepositoryName": PipelineProps.repo,
                                "BranchName": PipelineProps.branch,
                            },
                            "Name": "CodeCommitSource",
                            "OutputArtifacts": [
                                {
                                    "Name": "SourceArtifact"
                                }
                            ],
                        }
                    ],
                    "Name": "Source"
                }, {}
            ],
        });
    });

    test("Build Stage", () => {
        template.hasResourceProperties("AWS::CodePipeline::Pipeline", {
            "Stages": [
                {},
                {
                    "Actions": [
                        {
                            "ActionTypeId": {
                                "Category": "Build",
                                "Owner": "AWS",
                                "Provider": "CodeBuild"
                            },
                            "InputArtifacts": [
                                {
                                    "Name": "SourceArtifact"
                                }
                            ],
                            "Name": "codebuild",
                            "OutputArtifacts": [
                                {
                                    "Name": "BuildArtifact"
                                }
                            ],
                            "RunOrder": 1
                        }
                    ],
                    "Name": "Build"
                }
            ],
        });
    });

    test("Slack Notification", () => {
        template.hasResourceProperties("AWS::Chatbot::SlackChannelConfiguration", {});
    });
});