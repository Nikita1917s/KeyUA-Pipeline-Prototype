#!/usr/bin/env node
import { App }from 'aws-cdk-lib';
import { newPipelineStack } from '../lib/aws-pileline-stack';

const app = new App();

let PipelineProps = {
    //Select right actionName: (CodeStarConnectionsSource / CodeCommitSource)
    actionName: "<actionName>",
    connectionArn: "<connectionArn>",
    owner: "<owner>",
    repo: "<repo>",
    branch: "<branch>",
    projectName: "<projectName>",
    pipelineName: "<pipelineName>",
    slackNotifications: true || false,
    slackWorkspaceId: "<slackWorkspaceId>",
    slackChannelId: "<slackChannelId>"
};

new newPipelineStack(app, 'New--PipelineStack', PipelineProps);

app.synth();