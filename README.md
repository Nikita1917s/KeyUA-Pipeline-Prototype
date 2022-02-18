# Welcome Pipeline Creation Application!
### This Application will create a new Pipeline with main parameters set
## Useful commands
 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with the current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk bootstrap`   deployment of an AWS CloudFormation template to a specific AWS environment
 * `tsc`             compile typescript to js
 * `npm test`        run Unit Tests

# Decription

## To Install the application enter next commands to the console:
### 1) Install aws-cdk-templates.
`npm i aws-cdk-templates`
### 2) Add Codepipeline bootstrap script to package.json.
`npm set-script pipeline-bootstrap "cd ./node_modules/aws-cdk-templates && cdk bootstrap`
### 3) Add Codepipeline deployment script to package.json.
`npm set-script pipeline-deploy "cd ./node_modules/aws-cdk-templates && cdk deploy"`
* or
### Install package and scripts all together.
`npm i aws-cdk-templates && npm set-script pipeline-bootstrap "cd ./node_modules/aws-cdk-templates && cdk bootstrap" && npm set-script pipeline-deploy "cd ./node_modules/aws-cdk-templates && cdk deploy"`

## Pipeline Block
### To create a new Pipeline you will need to have and provide the next data in the `./node_modules/aws-cdk-templates/bin/aws-pileline.ts` file
* AWS Account with the corresponding Role to work with required permissions.
* All necessary params to create a new Pipeline and all needed services.

#### 1) Repository Credentials to be tracked

##### To use a GitHub (version 2) or BitBucket Repository in a CodePipeline:
Connection has to be established manually in the AWS Console !!!
* actionName: `CodeStarConnectionsSource`, (use this string!)
* owner: `UserName of the Repository owner` (ex: 'user123'), 
* repo: `Repository name` (ex: 'repository123'),
* branch: `Branch name` (ex: 'main'),
* connectionArn: `connectionArn can be taken after connection establishing in the 'AWS Pipelines' connections page` (ex: 'arn:aws:codestar-connections:us-east-2:123456789102:connection/1aa1a111-1111-1111-1111-1aa111a11a1a')  

##### To use a CodeCommit Repository in a CodePipeline:
* actionName: `CodeCommitSource`, (use this string!)
* repo: `Repository name` (ex: 'repository123'),
* branch: `Branch name` (ex: 'main'),

#### 2) New CloudFormation Stack --> PipelineProject info
* projectName: `Name of the new CloudFormation Stack (Project) to be created` (ex: 'newPipelineStackProject').

#### 3) New Pipeline Instace info
* pipelineName: `Name of the new Pipeline Instace to be created` (ex: 'newFirstPipeline').

## Slack Notifications Block
* To create a Slack Notifications you have to pass the `true` boolean in the corresponding prop
### To connect a recently created Pipeline to the Slack app in order to recieve notifications
1) Create a new Slack Channel in your Slack WorkSpace.
2) Establish a new Connection in the 'AWS Chatbot' ('Configure a new client)  
--> slackWorkspaceId can be taken from 'AWS Chatbot' --> 'Slack workspace' Client.
4) Add slackWorkspaceId to the Notification Rule.
5) Check the Slack App after Pipeline process 

## To Deploy the Codepipeline enter to the console next commands:
1) `npm run pipeline-bootstrap` deployment of an AWS CloudFormation template to a specific AWS environment
2) `npm run pipeline-deploy`    deploy this stack to your default AWS account/region