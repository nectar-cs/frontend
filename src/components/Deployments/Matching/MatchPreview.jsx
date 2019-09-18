import React, {Fragment} from 'react';
import LeftHeader from '../../../widgets/LeftHeader/LeftHeader';
import PropTypes from 'prop-types'
import MiscUtils from '../../../utils/MiscUtils';
import TextOverLineTitle from '../../../widgets/TextOverLineTitle/TextOverLineTitle';
import MatchForm from './MatchForm';
import s from './MatchPreview.sass'
import CenterAnnouncement from '../../../widgets/CenterAnnouncement/CenterAnnouncement';
import defaults from './defaults'
import { ROUTES } from '../../../containers/RoutesConsts';
import TopLoader from "../../../widgets/TopLoader/TopLoader";
import DataUtils from "../../../utils/DataUtils";
import Backend from "../../../utils/Backend";
import {FormHelper as H} from "./FormHelper";

export default class MatchPreview extends React.Component {
  constructor(props){

    super(props);
    this.state = {
      bundle: {
        framework: '',
        gitRemoteName: '',
        gitRepoName: '',
        imgRegistryName: '',
        imgRepoName: '',
        gitRemoteList: [],
        imgRegistryList: []
      },
      isGitFetching: false,
      isDockerFetching: false,
    };

    this.deploymentName = props.deployment.name;
    this.onFormDataChanged = this.onFormDataChanged.bind(this);
  }

  componentDidMount() {
    if (this.props.hasGitRemote)
      this.fetchGitRepos();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.deployment){
      this.deploymentName = nextProps.deployment.name;
      if(this.props.deployment.name !== this.deploymentName){
        if(this.props.hasGitRemote)
          this.onNewDeployment();
      }
    }
  }


  render(){
    return(
      <Fragment>
        { this.renderSubmitted() }
        { this.renderReviewComplete() }
        { this.renderMainContent() }
      </Fragment>
    );
  }

  renderMainContent(){
    if(this.props.isSubmitting) return null;
    if(!this.props.deployment) return null;

    return(
      <Fragment>
        { this.renderHeader() }
        { this.renderTopRightLoader() }
        { this.renderTitle() }
        { this.renderForm() }
        { this.renderNextButton() }
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
        graphicName={this.frameworkImage()}
        title={this.props.deployment.name}
        subtitle='A connected app'
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
      return <TopLoader isFetching={true}/>;
    else return null;
  }

  renderNextButton(){
    if(this.state.isGitFetching) return null;
    if(this.state.isDockerFetching) return null;

    return(
      <button className={s.confirm}  onClick={() => this.onAccepted()}>
        Confirm & Review Next
      </button>
    )
  }

  renderReviewComplete(){
    if(!this.props.isReviewComplete) return null;

    return(
      <CenterAnnouncement
        action={this.props.submitFunction}
        iconName='done'
        text="Review Complete. Click to commit."
      />
    )
  }

  frameworkImage(){
    const framework = this.state.bundle.framework;
    return MiscUtils.frameworkImage( framework || 'docker');
  }

  bundle(){
    return this.state.bundle;
  }

  renderSubmitted(){
    if(!this.props.isSubmitted) return null;
    return(
      <CenterAnnouncement
        contentType={'nav-link'}
        routeTo={ROUTES.workspaces.index.path}
        iconName='done_all'
        text="All done. Click to continue."
      />
    )
  }

  onAccepted(){
    this.props.onDeploymentReviewed(
      this.props.deployment.name,
      this.bundle()
    );
  }

  onFormDataChanged(key, value){
    let change = {};
    if(key === 'gitRemoteName')
      change = this.setGitRemoteName(value);
    else if(key === 'gitRepoName')
      change = this.setGitRepoName(value);
    else change = { [key]: value };

    this.updateBundle(change);
  }

  onNewDeployment(){
    const remotes = this.state.bundle.gitRemoteList;
    this.updateBundle(this.setGitRemotesList(remotes));
  }

  setGitRemotesList(gitRemoteList){
    const remote = gitRemoteList[0];
    const remoteName = remote.identifier;
    const downstream = this.setGitRemoteName(remoteName, {gitRemoteList});
    return { gitRemoteList, ...downstream };
  }

  setGitRemoteName(gitRemoteName, upChanges){
    const { gitRemoteList } = upChanges || this.state.bundle;
    const repoNames = H.gitRepoNames(gitRemoteList, gitRemoteName);
    const gitRepoName = H.guessRepo(repoNames, this.deploymentName);
    const changes = {...upChanges, gitRemoteName};
    return {gitRemoteName, ...this.setGitRepoName(gitRepoName, changes)};
  }

  setGitRepoName(gitRepoName, upChanges){
    const { gitRemoteList, gitRemoteName } = upChanges || this.state.bundle;
    const repo = H.selectedRepo(gitRemoteList, gitRemoteName, gitRepoName);
    return { gitRepoName, framework: repo.framework }
  }

  fetchGitRepos(){
    this.setState(s => ({...s, isGitFetching: true}));
    Backend.raisingFetch('/git_remotes/loaded', (payload) => {
      const data = DataUtils.objKeysToCamel(payload)['data'];
      this.updateBundle(this.setGitRemotesList(data));
      this.setState(s => ({...s, isGitFetching: false}));
    });
  }

  updateBundle(changes){
    this.setState(s => ({...s, bundle: {...s.bundle, ...changes}}));
  }

  static propTypes = {
    deployment: PropTypes.object,
    isSubmitted: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isReviewComplete: PropTypes.bool.isRequired,
    onDeploymentReviewed: PropTypes.func.isRequired,
    submitFunction: PropTypes.func.isRequired,
    hasGitRemote: PropTypes.bool.isRequired,
    hasImageRegistry: PropTypes.bool.isRequired
  };
}