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
      isImgFetching: false,
      isSubmitting: false,
      isPathsFetching: false,
      matching: null
    };

    this.update = this.update.bind(this);
    this.fetchDfPaths = this.fetchDfPaths.bind(this);
    this.updateAssign = this.updateAssign.bind(this);
    this.submit = this.submit.bind(this);
    this.updateRemotesList = this.updateRemotesList.bind(this);
    this.updateFetchProg = this.updateFetchProg.bind(this);
  }

  componentDidMount() {
    this.gulper = new Gulper();
    Helper.fetchGitRemotes('git', this.updateRemotesList, this.updateFetchProg);
    Helper.fetchGitRemotes('img', this.updateRemotesList, this.updateFetchProg);
  }

  componentWillReceiveProps(): * {
    const { gitRemoteName, imgRemoteName } = this.state.choices;
    if(gitRemoteName) this.updateAssign({gitRemoteName});
    if(imgRemoteName) this.updateAssign({imgRemoteName});
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
    const { imgRemoteList, imgRemoteName, imgRepoName } = choices;
    const { dfPathDict } = choices;

    return(
      <MatchForm
        gitRemoteChoices={Helper.remoteOptions(choices.gitRemoteList)}
        imgRemoteChoices={Helper.remoteOptions(choices.imgRemoteList)}
        gitRepoChoices={Helper.repoOptions(gitRemoteList, gitRemoteName)}
        imgRepoChoices={Helper.repoOptions(imgRemoteList, imgRemoteName)}
        dfPathChoices={Helper.dfPathChoices(gitRemoteName, gitRepoName, dfPathDict)}
        gitRemoteName={gitRemoteName}
        gitRepoName={gitRepoName}
        imgRemoteName={imgRemoteName}
        imgRepoName={imgRepoName}
        dfPath={choices.dfPath}
        buildCtxPath={choices.buildCtxPath}
        framework={choices.framework}
        notifyFormValueChanged={this.update}
      />
    )
  }

  renderTopRightLoader(){
    if(!Helper.isLoading(this.state)) return null;
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

  updateRemotesList(type, remoteList: Array<RemoteBundle>): void {
    console.log("RECEIVED " + type);
    console.log(remoteList);
    this.update(`${type}RemoteList`, remoteList)
  }

  updateAssign(assignment:{string: any}): void{
    Object.keys(assignment).forEach(key => {
      this.update(key, assignment[key]);
    });
  }

  amInDetailMode(){ return this.props.mode === 'detail'; }
  updateFetchProg(type, status) {
    const key = `is${type[0].toUpperCase() + type.slice(1)}Fetching`;
    console.log(`${type} --> ${status}`);
    this.setState(s => ({ ...s, [key]: status }))
  }

  static defaultChoices(_){
    return({
      gitRemoteList: [], imgRemoteList: [], dfPathDict: {},
      gitRemoteName: '', imgRemoteName: '',
      gitRepoName: '', imgRepoName: '',
      dfPath: '', framework: '', buildCtxPath: ''
    });
  }
}

type State = {
  choices: {
    gitRemoteList: Array<RemoteBundle>,
    imgRemoteList: Array<RemoteBundle>,
    dfPath: string,
    dfPathDict: { [string]: Array<string> },
    buildCtxPath: string,
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