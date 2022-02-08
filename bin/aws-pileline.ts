#!/usr/bin/env node
import { App }from 'aws-cdk-lib';
import { newPipelineStack } from '../lib/aws-pileline-stack';

const app = new App();

let PipelineProps = {
    owner: "Nikita1917s",
    repo: "KeyUA-Pipeline-Prototype",
    branch: "main",
    oauthToken: 'GITHUB_OAUTH_TOKEN_TESTING',
    projectName: "Updated--PipelineStackProject",
    pipelineName: "Updated--FirstPipeline",
    slackWorkspaceId: "TG1K2568N",
    slackChannelId: "C031Z1KJH6C"
}

new newPipelineStack(app, 'New--PipelineStack', PipelineProps);

app.synth();