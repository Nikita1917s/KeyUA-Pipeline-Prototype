#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { newPipelineStack } from '../lib/aws-pileline-stack';

const app = new cdk.App();

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

new newPipelineStack(app, 'Updated--PipelineStack', PipelineProps);

app.synth();