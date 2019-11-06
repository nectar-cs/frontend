//@flow
import React, {Fragment} from 'react';
import LeftHeader from '../../widgets/LeftHeader/LeftHeader';
import MatchForm from './MatchForm';
import Button from "../../assets/buttons";
import MiscUtils from "../../utils/MiscUtils";
import Loader from "../../assets/loading-spinner";
import defaults from './defaults'
import Helper from "./Helper";
import type {Deployment, Matching, RemoteBundle} from "../../types/Types";
import Gulper from "./Gulper";

export default class MatchModal extends React.Component<Props, State> {
  constructor(props){

    super(props);
    this.state = {
      choices: MatchModal.defaultChoices(props),
      isGitFetching: false,
      isDockerFetching: false,
      isSubmitting: false,
      isPathsFetching: false,
      matching: null
    };

    this.gulper = new Gulper();
    this.update = this.update.bind(this);
    this.fetchDfPaths = this.fetchDfPaths.bind(this);
    this.updateAssign = this.updateAssign.bind(this);
    this.acceptMatch = this.acceptMatch.bind(this);
    this.skipMatch = this.skipMatch.bind(this);
  }

  componentDidMount() {
    Helper.fetchGitRemotes(this);
  }

  render(){
    return(
      <Fragment>
        { this.renderHeader() }
        { this.renderTopRightLoader() }
        { this.renderForm() }
        { this.renderButtons() }
      </Fragment>
    )
  }

  renderHeader(){
    let { mode, deployment } = this.props;
    const { framework } = this.state.choices;
    return(
      <LeftHeader
        graphicName={Helper.frameworkImage(mode, framework)}
        graphicType={Helper.graphicType(mode)}
        title={defaults.header.title(mode, deployment)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderForm(){
    const { choices } = this.state;
    const { gitRemoteList, gitRemoteName, gitRepoName } = choices;
    const { dfPathDict } = choices;

    return(
      <MatchForm
        deployment={this.props.deployment}
        gitRemoteChoices={Helper.remoteOptions(choices.gitRemoteList)}
        imgRemoteChoices={Helper.remoteOptions()}
        gitRepoChoices={Helper.repoOptions(gitRemoteList, gitRemoteName)}
        imgRepoChoices={Helper.remoteOptions()}
        dfPathChoices={Helper.dfPathChoices(gitRemoteName, gitRepoName, dfPathDict)}
        gitRemoteName={gitRemoteName}
        gitRepoName={gitRepoName}
        dfPath={choices.dfPath}
        framework={choices.framework}
        notifyFormValueChanged={this.update}
      />
    )
  }

  renderTopRightLoader(){
    if(!Helper.isLoading(this)) return null;
    return <Loader.TopRightSpinner/>;
  }

  renderButtons(){
    const { mode } = this.props;
    return(
      <Button.BigBottomButtons>
        <Button.BigButton onClick={this.acceptMatch}>
          Submit { mode }
        </Button.BigButton>
      </Button.BigBottomButtons>
    );
  }

  acceptMatch(){
    const { mode, onDeploymentReviewed, deployment } = this.props;
    if(mode === 'tutorial') onDeploymentReviewed(deployment.name, deployment);
    else Helper.submitSingle(this, deployment);
  }

  skipMatch(){
    const { mode, deployment, onDeploymentReviewed } = this.props;
    if(mode === 'tutorial') onDeploymentReviewed(deployment.name, null);
    else Helper.submitDelete(this, deployment);
  }

  update(field: string, value: any): void {
    const bundle = this.createPassDownBundle();
    const assignment = this.gulper.assign(field, value, bundle);
    const choices = {...this.state.choices, ...assignment};
    this.setState(s => ({...s, choices}));
  }

  createPassDownBundle(){
    const { choices } = this.state;
    const fetchDfPaths = this.fetchDfPaths;
    return { ...choices, fetchDfPaths };
  }

  fetchDfPaths(remoteName: string, repoName: string){
    const { dfPathDict } = this.state.choices;
    Helper.fetchDfPaths(
      remoteName,
      repoName,
      dfPathDict,
      (isPathsFetching) => this.setState(s => ({...s, isPathsFetching})),
      (dfPathDict) => this.updateAssign({dfPathDict})
    )
  }

  updateGitRemotesList(gitRemoteList: Array<RemoteBundle>): void {
    this.updateAssign({gitRemoteList});
  }

  updateAssign(assignment:{string: any}){
    Object.keys(assignment).forEach(key => {
      this.update(key, assignment[key]);
    });
  }

  static defaultChoices(_){
    return({
      gitRemoteList: [], imgRemoteList: [], dfPathDict: {},
      gitRemoteName: '', imgRemoteName: '',
      gitRepoName: '', imgRepoName: '',
      dfPath: '', framework: ''
    });
  }
}

type State = {
  choices: {
    gitRemoteList: Array<RemoteBundle>,
    imgRemoteList: Array<RemoteBundle>,
    dfPath: string,
    dfPathDict: { [string]: Array<string> },
    gitRemoteName: string,
    imgRemoteName: string,
    gitRepoName: string,
    imgRepoName: string,
  }
}

type Props = {
  mode: 'detail' | 'tutorial',
  deployment: Deployment,
  matching: Matching,
  onDeploymentReviewed: () => void,
}