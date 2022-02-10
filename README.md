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

## Decription

### Pipeline Block
#### To create a new Pipeline you will need to have/provide the next data
* AWS Account with the corresponding Role to work with required permissions.
* All necessary params to create a new Pipeline and all needed services.

1) Repository Credentials to be tracked

#### To use a GitHub (version 2) or BitBucket Repository in a CodePipeline:
Connection has to be established manually in the AWS Console !!!
* actionName: `CodeStarConnectionsSource`, (use this string!)
* owner: `UserName of the Repository owner` (ex: 'user123'), 
* repo: `Repository name` (ex: 'repository123'),
* branch: `Branch name` (ex: 'main'),
* connectionArn: `connectionArn can be taken after connection establishing in the 'AWS Pipelines' connections page` (ex: 'arn:aws:codestar-connections:us-east-2:666398651410:connection/ff28b735-d3b5-4d03-bf79-1fb378a81b4a')  

#### To use a CodeCommit Repository in a CodePipeline:
* actionName: `CodeCommitSource`, (use this string!)
* repo: `Repository name` (ex: 'repository123'),
* branch: `Branch name` (ex: 'main'),


2) New CloudFormation Stack --> PipelineProject info
* projectName: `Name of the new CloudFormation Stack (Project) to be created` (ex: 'newPipelineStackProject').

3) New Pipeline Instace info
* pipelineName: `Name of the new Pipeline Instace to be created` (ex: 'newFirstPipeline').

    actionName: "CodeCommitSource",
    connectionArn: "arn:aws:codestar-connections:us-east-2:666398651410:connection/ff28b735-d3b5-4d03-bf79-1fb378a81b4a",


#### Slack Notifications Block
* To create a Slack Notifications you have to pass the `true` boolean in the corresponding prop
##### To connect a recently created Pipeline to the Slack app in order to recieve notifications
1) Create a new Slack Channel in your Slack WorkSpace.
2) Establish a new Connection in the 'AWS Chatbot' ('Configure a new client)  
--> slackWorkspaceId can be taken from 'AWS Chatbot' --> 'Slack workspace' Client.
4) Add slackWorkspaceId to the Notification Rule.
5) Check the Slack App after Pipeline process 

## To run the application enter to the console next commands:
1) `cdk bootstrap`   deployment of an AWS CloudFormation template to a specific AWS environment
2) `cdk deploy`      deploy this stack to your default AWS account/region