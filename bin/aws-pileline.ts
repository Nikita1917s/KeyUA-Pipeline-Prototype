#!/usr/bin/env node
import { App }from 'aws-cdk-lib';
import { newPipelineStack } from '../lib/aws-pileline-stack';

const app = new App();

let PipelineProps = {
    //actionName: "CodeStarConnectionsSource",
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

new newPipelineStack(app, 'New--PipelineStack', PipelineProps);

app.synth();