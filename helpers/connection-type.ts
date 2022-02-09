import * as cdk from 'aws-cdk-lib';

interface ConnectionTypes {
    actionName: string,
    owner: string,
    repo: string,
    branch: string,
    connectionArn: string,
    codecommitRepository: cdk.aws_codecommit.IRepository
};

export function ConnectionType(props: ConnectionTypes) {

    //Create Artifacts for the Actions Outputs
    const sourceArtifact = new cdk.aws_codepipeline.Artifact('SourceArtifact');

    //To use a GitHub (version 2) or BitBucket Repository in a CodePipeline:
    const CodeStarConnectionsSource = new cdk.aws_codepipeline_actions.CodeStarConnectionsSourceAction({
        actionName: 'CodeStarConnectionsSource',
        owner: props.owner,
        repo: props.repo,
        branch: props.branch,
        connectionArn: props.connectionArn,
        output: sourceArtifact,
    });

    //To use a CodeCommit Repository in a CodePipeline:
    const CodeCommitSource = new cdk.aws_codepipeline_actions.CodeCommitSourceAction({
        actionName: 'CodeCommitSource',
        repository: props.codecommitRepository,
        branch: props.branch,
        output: sourceArtifact,
    });

    //Get right Repository connection type
    if (props.actionName === "CodeCommitSource") {
        return CodeCommitSource;
    }
    else {
        return CodeStarConnectionsSource;
    };
};