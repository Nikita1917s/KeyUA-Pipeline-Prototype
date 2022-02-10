import { Template } from "aws-cdk-lib/assertions";
import { App } from "aws-cdk-lib";
import { newPipelineStack } from "../lib/aws-pileline-stack";

const app = new App();

let PipelineProps = {
    //Select right actionName: (CodeStarConnectionsSource / CodeCommitSource)
    actionName: "CodeCommitSource",
    connectionArn: "arn:aws:codestar-connections:us-east-2:666398651410:connection/ff28b735-d3b5-4d03-bf79-1fb378a81b4a",
    owner: "Nikita1917s",
    repo: "KeyUA-Pipeline-Prototype",
    branch: "main",
    projectName: "Updated--PipelineStackProject",
    pipelineName: "Updated--FirstPipeline",
    slackNotifications: true,
    slackWorkspaceId: "TG1K2568N",
    slackChannelId: "C031Z1KJH6C"
};

// Create the ProcessorStack.
const processorStack = new newPipelineStack(app, 'New--PipelineStack', PipelineProps);

// Prepare the stack for assertions.
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