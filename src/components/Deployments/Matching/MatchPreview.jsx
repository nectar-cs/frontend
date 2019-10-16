import React, {Fragment} from 'react';
import LeftHeader from '../../../widgets/LeftHeader/LeftHeader';
import PropTypes from 'prop-types'
import TextOverLineTitle from '../../../widgets/TextOverLineTitle/TextOverLineTitle';
import MatchForm from './MatchForm';
import defaults from './defaults'
import DataUtils from "../../../utils/DataUtils";
import Backend from "../../../utils/Backend";
import {FormHelper as H} from "./FormHelper";
import Button from "../../../assets/buttons";
import MiscUtils from "../../../utils/MiscUtils";
import {Types} from "../../../types/Deployment";
import Loader from "../../../assets/loading-spinner";
import Helper from "./Helper";

export default class MatchPreview extends React.Component {
  constructor(props){

    super(props);
    this.state = {
      bundle: {
        gitRemoteName: '', imgRemoteName: '',
        gitRepoName: '', imgRepoName: '',
        gitRemoteList: [], imgRemoteList: [],
        framework: ''
      },
      isGitFetching: false,
      isDockerFetching: false,
      isSubmitting: false,
      matching: null
    };

    this.deploymentName = MiscUtils.tor(() => props.deployment.name);
    this.onFormDataChanged = this.onFormDataChanged.bind(this);
    this.acceptMatch = this.acceptMatch.bind(this);
    this.skipMatch = this.skipMatch.bind(this);
  }

  componentDidMount() {
    if (this.props.hasGitRemote)
      this.fetchGitRepos();

    if (this.props.hasImageRegistry)
      this.fetchImageRepos();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.deployment){
      this.deploymentName = nextProps.deployment.name;
      if(this.props.deployment.name !== this.deploymentName){
        if(this.props.hasGitRemote) this.onNewDeployment('git');
        if(this.props.hasImageRegistry) this.onNewDeployment('img');
      }
    }
  }

  render(){
    return(
      <Fragment>
        { this.renderHeader() }
        { this.renderTopRightLoader() }
        { this.renderTitle() }
        { this.renderForm() }
        { this.renderButtons() }
      </Fragment>
    )
  }

  renderTitle(){
    return(
      <Fragment>
        <TextOverLineTitle text={defaults.previewTitle}/>
        <p>{defaults.previewIntro}</p>
      </Fragment>
    )
  }

  renderHeader(){
    return(
      <LeftHeader
        graphicName={H.frameworkImage(this)}
        graphicType={H.graphicType(this)}
        title={H.title(this)}
        subtitle='Wizard'
      />
    )
  }

  renderForm(){
    return(
      <MatchForm
        deployment={this.props.deployment}
        notifyChanged={this.onFormDataChanged}
        hasGitRemote={this.props.hasGitRemote}
        hasImageRegistry={this.props.hasImageRegistry}
        {...this.state.bundle}
      />
    )
  }

  renderTopRightLoader(){
    if(this.state.isGitFetching || this.state.isDockerFetching)
      return <Loader.TopRightSpinner/>;
    else return null;
  }

  renderButtons(){
    if(this.state.isGitFetching) return null;
    if(this.state.isDockerFetching) return null;

    const NegativeButton = () => (
      Helper.showNeg(this) && <Button.BigButton
        emotion='idle'
        onClick={this.skipMatch}>
        { defaults.previewButtons.negative[mode] }
      </Button.BigButton>
    );

    const { mode } = this.props;
    return(
      <Button.BigBottomButtons>
        <NegativeButton/>
        <Button.BigButton onClick={this.acceptMatch}>
          { defaults.previewButtons.positive[mode] }
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

  onFormDataChanged(key, value){
    let change = {};
    if(key === 'gitRemoteName')
      change = H.setRemoteName('git', this, value);
    else if(key === 'gitRepoName')
      change = H.setRepoName('git', this, value);
    else if(key === 'imgRemoteName')
      change = H.setRemoteName('img', this, value);
    else if(key === 'imgRepoName')
      change = H.setRepoName('img', this, value);
    else change = { [key]: value };

    this.updateBundle(change);
  }

  onNewDeployment(type){
    const remotes = this.state.bundle[`${type}RemoteList`];
    this.updateBundle(H.setRemotesList(type, this, remotes));
  }

  fetchGitRepos(){
    this.setState(s => ({...s, isGitFetching: true}));
    Backend.raisingFetch('/remotes/loaded?entity=git', (payload) => {
      const data = DataUtils.objKeysToCamel(payload)['data'];
      this.updateBundle(H.setRemotesList('git', this, data));
      this.setState(s => ({...s, isGitFetching: false}));
      Helper.fetchMatching(this);
    });
  }

  fetchImageRepos(){
    this.setState(s => ({...s, isDockerFetching: true}));
    Backend.raisingFetch('/remotes/loaded?entity=docker', (payload) => {
      const data = DataUtils.objKeysToCamel(payload)['data'];
      this.updateBundle(H.setRemotesList('img', this, data));
      this.setState(s => ({...s, isDockerFetching: false}));
      Helper.fetchMatching(this);
    });
  }

  updateBundle(changes){
    this.setState(s => ({...s, bundle: {...s.bundle, ...changes}}));
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