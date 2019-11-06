//@flow
import React, {Fragment} from 'react';
import LeftHeader from '../../widgets/LeftHeader/LeftHeader';
import PropTypes from 'prop-types'
import MatchForm from './MatchForm';
import Button from "../../assets/buttons";
import MiscUtils from "../../utils/MiscUtils";
import {Types} from "../../types/CommonTypes";
import Loader from "../../assets/loading-spinner";
import Helper from "./Helper";
import defaults from './defaults'
import RemotesHelper from "./RemotesHelper";
import type {Deployment, Matching, RemoteBundle} from "../../types/Types";

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

    this.deploymentName = MiscUtils.tor(() => props.deployment.name);
    this.update = this.update.bind(this);
    this.updateAssign = this.updateAssign.bind(this);
    this.acceptMatch = this.acceptMatch.bind(this);
    this.skipMatch = this.skipMatch.bind(this);
  }

  componentDidMount() {
    const { matching } = this.props;
    Helper.injestMatching(matching, this.update);
    RemotesHelper.fetchGitRemotes(this);
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
    const { mode, deployment } = this.props;
    return(
      <LeftHeader
        graphicName={Helper.frameworkImage(this)}
        graphicType={MiscUtils.modalGraphicType(this)}
        title={defaults.header.title(mode, deployment)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderForm(){
    const { choices } = this.state;

    return(
      <MatchForm
        deployment={this.props.deployment}
        gitRemoteChoices={RemotesHelper.remoteOptions()}
        imgRemoteChoices={RemotesHelper.remoteOptions()}
        gitRepoChoices={RemotesHelper.remoteOptions()}
        imgRepoChoices={RemotesHelper.remoteOptions()}
        dfPathChoices={RemotesHelper.dockerfileChoices()}
        gitRemoteName={choices.gitRemoteName}
        gitRepoName={choices.gitRepoName}
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
    const { mode, onDeploymentReviewed } = this.props;
    const deployment = this.state.bundle;
    if(mode === 'tutorial')
      onDeploymentReviewed(this.deploymentName, deployment);
    else Helper.submitSingle(this, deployment);
  }

  skipMatch(){
    const { mode, onDeploymentReviewed } = this.props;
    const deployment = this.state.bundle;
    if(mode === 'tutorial')
      onDeploymentReviewed(this.deploymentName, null);
    else Helper.submitDelete(this, deployment);
  }

  update(field: string, value){
    console.log("HELLLLLOOO " + field);
    const choices = {...this.state.choices, [field]: value};
    this.setState(s => ({...s, choices}));
  }

  updateGitRemotesList(list: Array<RemoteBundle>): void {
    this.update("gitRemotesList", list);
  }

  updateAssign(assignment){
    Object.keys(assignment).forEach(key => {
      this.update(key, assignment[key]);
    });
  }

  static defaultChoices(_){
    return({
      gitRemoteList: [],
      imgRemoteList: [],
      dfPathList: [],

      gitRemoteName: '',
      imgRemoteName: '',
      gitRepoName: '',
      imgRepoName: '',

      dfPath: '',
      framework: ''
    });
  }

  static propTypes = {
    deployment: PropTypes.object,
    matching: Types.Deployment,
    onDeploymentReviewed: PropTypes.func,
    hasGitRemote: PropTypes.bool.isRequired,
    hasImageRegistry: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['detail', 'tutorial']).isRequired
  };
}

type State = {
  choices: {
    gitRemoteList: Array<RemoteBundle>,
    imgRemoteList: Array<RemoteBundle>,
    dfPathList: Array<string>,
    gitRemoteName: string,
    imgRemoteName: string,
    gitRepoName: string,
    imgRepoName: string,
  }
}

type Props = {
   deployment: Deployment,
   matching: Matching,
   onDeploymentReviewed: () => void,
   hasImageRegistry: boolean,
   mode: 'detail' | 'tutorial'
 }