#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { MyPipelineStack } from '../lib/aws-pileline-stack';
// import {Repository} from "@aws-cdk/aws-ecr";

// declare const repository: Repository;

// repository.onImageScanCompleted('ImageScanComplete')

// interface StackParams {
//   // env: object
//   repository: Repository
//   // codepipelineSuccessSlackConfig: SlackChannelConfiguration
//   // codepipelineFailedSlackConfig: SlackChannelConfiguration
// }
// const StackParams = {
// //   repository: 'https://github.com/Nikita1917s/KeyUA-Pipeline-Prototype.git'
// repository: Repository

// }

const app = new cdk.App();
new MyPipelineStack(app, 'MyPipelineStack');

app.synth();