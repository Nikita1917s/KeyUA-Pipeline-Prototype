# Welcome Pipeline Creation Application!
### This Application will create a new Pipeline with all nessesary paramenters set
## Useful commands
 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk bootstrap`   deployment of a AWS CloudFormation template to a specific AWS environment

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
To save a new password type to console:  -->  
(aws secretsmanager create-secret --name GITHUB_OAUTH_TOKEN   --description "The password for Personal access token"   
--secret-string "ghp_nnV1zjLxJbYrt22eDpko6hm2qiL9el4dnbpE")
2) New CloudFormation Stack --> PipelineProject info
* projectName: `Name of the new CloudFormation Stack (Project) to be created` (ex: 'newPipelineStackProject').
3) New Pipeline Instace info
* pipelineName: `Name of the new Pipeline Instace to be created` (ex: 'newFirstPipeline').



#### Slack Notifications Block
* To create a Slack Notifications you have to pass `true` boolean in corresponding prop
##### To connect a recently created Pipeline to the Slack app in order to recieve notifications
1) Create a new Slack Channel in your Slack WorkSpace.
2) Establish a new Connection in the 'AWS Chatbot' ('Configure a new client)  
--> slackWorkspaceId can be taken from 'AWS Chatbot' --> 'Slack workspace' Client.
4) Add slackWorkspaceId to the Notification Rule.
5) Check the Slack App after Pipeline process 

## To run the application enter to the console next commands:
1) `cdk bootstrap`   deployment of a AWS CloudFormation template to a specific AWS environment
2) `cdk deploy`      deploy this stack to your default AWS account/region