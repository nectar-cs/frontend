//@flow
import React, {Fragment} from 'react';
import LeftHeader from '../../widgets/LeftHeader/LeftHeader';
import MatchForm from './MatchForm';
import {Button, Loader, Text} from "ui-common";
import defaults from './defaults'
import Helper from "./Helper";
import type {Deployment, Matching, RemoteBundle} from "../../types/Types";
import Gulper from "./Gulper";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import IntegrationsModal from "../IntegrationsModal/IntegrationsModal";
import ModalClientComposer from "../../hocs/ModalClientComposer";
import DataUtils from "../../utils/DataUtils";
import Utils from "../../utils/Utils";

class MatchModalClass extends React.Component<Props, State> {
  constructor(props){

    super(props);
    this.state = {
      choices: MatchModal.defaultChoices(props),
      isGitFetching: false,
      isImgFetching: false,
      isSubmitting: false,
      isPathsFetching: false
    };

    this.update = this.update.bind(this);
    this.fetchDfPaths = this.fetchDfPaths.bind(this);
    this.updateAssign = this.updateAssign.bind(this);
    this.submit = this.submit.bind(this);
    this.delete = this.delete.bind(this);
    this.updateRemotesList = this.updateRemotesList.bind(this);
    this.updateFetchProg = this.updateFetchProg.bind(this);
    this.reloadRemotes = this.reloadRemotes.bind(this);
  }

  componentDidMount() {
    Utils.mp("Matching Start", {});
    this.gulper = new Gulper();
    this.gulper.setConsumableMatching(this.props.matching);
    this.reloadRemotes();
  }

  componentWillReceiveProps(nextProps:Props): * {
    const oldMatching = this.props.matching;
    const newMatching = nextProps.matching;
    const matchChanged = !DataUtils.deepEqual(oldMatching, newMatching);

    const oldDepName = this.state.choices.deploymentName;
    const newDepName = nextProps.deployment.name;
    const depChanged = oldDepName !== newDepName;

    if(matchChanged)
      this.gulper.setConsumableMatching(nextProps.matching);

    if(depChanged)
      this.update('deploymentName', nextProps.deployment.name);
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
        { this.renderNoRemotesPrompt() }
        { this.renderButtons() }
      </Fragment>
    )
  }

  renderNoRemotesPrompt(){
    if(Helper.isLoading(this.state)) return null;
    if(this.hasAnyRemotes()) return null;
    return(
      <CenterAnnouncement
        iconName='extension'
        text="Matching only works with Git/Docker. Click to connect."
        action={() => this.openIntegrationsModal()}
        light={true}
      />
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
    if(!this.hasAnyRemotes()) return null;

    const { choices } = this.state;
    const { gitRemoteList, gitRemoteName, gitRepoName } = choices;
    const { imgRemoteList, imgRemoteName, imgRepoName } = choices;
    const { dfPathDict } = choices;
    const dfPaths = Helper.dfPathChoices(
      gitRemoteName, gitRepoName, dfPathDict
    );

    return(
      <MatchForm
        gitRemoteChoices={Helper.remoteOptions(choices.gitRemoteList)}
        imgRemoteChoices={Helper.remoteOptions(choices.imgRemoteList)}
        gitRepoChoices={Helper.repoOptions(gitRemoteList, gitRemoteName)}
        imgRepoChoices={Helper.repoOptions(imgRemoteList, imgRemoteName)}
        dfPathChoices={dfPaths}
        gitRemoteName={gitRemoteName}
        gitRepoName={gitRepoName}
        imgRemoteName={imgRemoteName}
        imgRepoName={imgRepoName}
        dockerfilePath={choices.dockerfilePath}
        dockerBuildPath={choices.dockerBuildPath}
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
    if(Helper.isLoading(this.state)) return null;
    if(!this.hasAnyRemotes()) return null;

    return(
      <Button.BigBottomButtons>
        { this.renderDeleteButton() }
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

  renderDeleteButton(){
    if(!this.props.matching) return null;
    return(
      <Button.BigButton onClick={this.delete} emotion='idle'>
        { "Un-Match" }
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
    this.mixTrack();
    Helper.submit(deployment.name, this.state.choices, callback);
  }

  mixTrack(){
    try{
      const { gitRemoteName, imgRemoteName } = this.state.choices;
      const [withGit, withDocker] = [!!gitRemoteName, !!imgRemoteName];
      const { mode } = this.props;
      Utils.mp('Matching Create', {withGit, withDocker, mode});
    } catch (e){
      Utils.senTrack(e);
    }
  }

  delete(){
    const { matching, callback } = this.props;
    Helper.delete(matching, callback);
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

  reloadRemotes(){
    Helper.fetchRemotes('git', this.updateRemotesList, this.updateFetchProg);
    Helper.fetchRemotes('img', this.updateRemotesList, this.updateFetchProg);
  }

  updateRemotesList(type, remoteList: Array<RemoteBundle>): void {
    this.update(`${type}RemoteList`, remoteList)
  }

  updateAssign(assignment:{string: any}): void{
    Object.keys(assignment).forEach(key => {
      this.update(key, assignment[key]);
    });
  }

  updateFetchProg(type, status) {
    const key = `is${type[0].toUpperCase() + type.slice(1)}Fetching`;
    this.setState(s => ({ ...s, [key]: status }))
  }

  static defaultChoices(props){
    return({
      deploymentName: props.deployment.name,
      gitRemoteList: [], imgRemoteList: [], dfPathDict: {},
      gitRemoteName: '', imgRemoteName: '',
      gitRepoName: '', imgRepoName: '',
      dockerfilePath: '', framework: '', dockerBuildPath: ''
    });
  }

  hasAnyRemotes(){
    const { gitRemoteList, imgRemoteList } = this.state.choices;
    return gitRemoteList.length + imgRemoteList.length > 0;
  }

  amInDetailMode(){ return this.props.mode === 'detail'; }

  openIntegrationsModal(){
    this.props.openModal(
      IntegrationsModal,
      { onDataChanged: this.reloadRemotes }
    );
  }
}

type State = {
  choices: {
    gitRemoteList: Array<RemoteBundle>,
    imgRemoteList: Array<RemoteBundle>,
    dockerfilePath: string,
    dfPathDict: { [string]: Array<string> },
    dockerBuildPath: string,
    gitRemoteName: string,
    imgRemoteName: string,
    gitRepoName: string,
    imgRepoName: string,
    deploymentName: string
  }
}

type Props = {
  mode: 'detail' | 'tutorial',
  deployment: Deployment,
  matching: Matching,
  callback: () => void,
}

const MatchModal = ModalClientComposer.compose(
  MatchModalClass
);

export default MatchModal;