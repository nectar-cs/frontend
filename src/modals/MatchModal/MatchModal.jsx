//@flow
import React, {Fragment} from 'react';
import LeftHeader from '../../widgets/LeftHeader/LeftHeader';
import MatchForm from './MatchForm';
import Button from "../../assets/buttons";
import Loader from "../../assets/loading-spinner";
import defaults from './defaults'
import Helper from "./Helper";
import type {Deployment, Matching, RemoteBundle} from "../../types/Types";
import Gulper from "./Gulper";
import Text from "../../assets/text-combos";

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

    this.update = this.update.bind(this);
    this.fetchDfPaths = this.fetchDfPaths.bind(this);
    this.updateAssign = this.updateAssign.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.gulper = new Gulper();
    Helper.fetchGitRemotes(this);
  }

  componentWillReceiveProps(): * {
    const { gitRemoteName } = this.state.choices;
    if(gitRemoteName)
      this.updateAssign({gitRemoteName})
  }

  componentWillUnmount(): * {
    this.gulper = null;
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
    return(
      <Button.BigBottomButtons>
        { this.renderSubmitButton() }
        { this.renderSkipButton() }
      </Button.BigBottomButtons>
    );
  }

  renderSubmitButton(){
    const copy = `Save ${!this.amInDetailMode() ? "and to the Next" : ''}`;
    return(
      <Button.BigButton onClick={this.submit}>
        { copy }
      </Button.BigButton>
    )
  }

  renderSkipButton(){
    if(this.amInDetailMode()) return null;
    const { callback } = this.props;
    return <Text.PA low={4.6} onClick={callback}>Or Skip This One</Text.PA>;
  }

  submit(){
    const { deployment, callback } = this.props;
    Helper.submit(deployment.name, this.state.choices, callback);
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
    const deploymentName = this.props.deployment.name;
    return { ...choices, fetchDfPaths, deploymentName };
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

  amInDetailMode(){
    return this.props.mode === 'detail';
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
  callback: () => void,
}