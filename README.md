# Welcome Pipeline Creation Application!
### This Application will create a new Pipeline with all nessesary paramenters set
## Useful commands
 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Decription

#### Pipeline Block
##### To create a new Pipeline you will need to have/provide next data
* AWS Account with corresponding Role to work with required permissions.
* All nessesary params to create a new Pipeline and all needed servises.
1) GitHub Credidentials to be tracked
* owner: `UserName of the Repository owner` (ex: 'user123'), 
* repo: `Repository name` (ex: 'repository123'),
* branch: `Branch name` (ex: 'main'),
* oauthToken: `Secret that is located in the 'AWS Secrets Manager'` (ex: 'The password for a GITHUB - Personal access token')
2) New CloudFormation Stack --> PipelineProject info
    `+` projectName: `Name of the new CloudFormation Stack (Project) to be created` (ex: 'newPipelineStackProject').
3) New Pipeline Instace info
    `+` projectName: `Name of the new Pipeline Instace to be created` (ex: 'newFirstPipeline').


#### Slack Notifications Block
##### To connect a recently created Pipeline to the Slack app in order to recieve notifications
1) Create a new Slack Channel in your Slack WorkSpace.
2) Establish a new Connection in the 'AWS Chatbot' ('Configure a new client) 
--> slackWorkspaceId can be taken from 'AWS Chatbot' --> 'Slack workspace' Client.
3) Add slackWorkspaceId to the Notification Rule.
4) Check the Slack App after Pipeline process 