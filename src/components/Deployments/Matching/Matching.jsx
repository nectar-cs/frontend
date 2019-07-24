import React, {Fragment} from 'react';
import AuthenticatedComponent from '../../../hocs/AuthenticatedComponent';
import ls from '../../../assets/content-layouts.sass';
import {LeftHeader, ICON} from '../../../widgets/LeftHeader/LeftHeader';
import Backend from '../../../utils/Backend';
import DeploymentList from './DeploymentList';
import TopLoader from '../../../widgets/TopLoader/TopLoader';
import MatchPreview from './MatchPreview';
import KubeHandler from "../../../utils/KubeHandler";
import GithubAuth from "./GithubAuth";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";

const GIT_STATES = {
  CHECKING: 'checking',
  SHOWING_OFFER: 'waiting',
  NOT_CONNECTED: 'not-connected',
  CONNECTED: 'finished',

};

const DEFAULT_QUERY = [{field: "namespace", op: "one-of", challenge: ["default"]}];

const Header = function(){
  return(
    <LeftHeader
      title='Workspace Setup'
      subtitle='Choose deployments and map them to source code.'
      graphicType={ICON}
      graphicName='grid_on'
    />
  )
};

class MatchingClass extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isFetching: false,
      isRightFetching: false,
      githubState: null,
      authUrl: null,
      deployments: [],
      selectedIndex: null,
      isSubmitting: false,
      areAllSubmitted: false,
      query: DEFAULT_QUERY
    };

    this.onDeploymentReviewed = this.onDeploymentReviewed.bind(this);
    this.fetchClusterDeploys = this.fetchClusterDeploys.bind(this);
    this.submit = this.submit.bind(this);
    this.notifyGithubConcluded = this.notifyGithubConcluded.bind(this);
    this.notifyCheckAllChanged = this.notifyCheckAllChanged.bind(this);
    this.notifyCheckChanged = this.notifyCheckChanged.bind(this);
    this.notifyDeploymentSelected = this.notifyDeploymentSelected.bind(this);
  }

  componentDidMount(){
    this.fetchGithubAuth();
    this.fetchClusterDeploys();
  }

  render(){
    return(
      <React.Fragment>
        { this.renderLeftSide() }
        { this.renderRightSide() }
      </React.Fragment>
    )
  }

  renderLeftSide(){
    return(
      <div className={ls.halfScreePanelLeft}>
        <Header/>
        <TopLoader isFetching={this.state.isFetching}/>
        <DeploymentList
          deployments={this.state.deployments}
          selectedIndex={this.state.selectedIndex}
          notifyCheckChanged={this.notifyCheckChanged}
          notifyCheckAllChanged={this.notifyCheckAllChanged}
          notifyDeploymentSelected={this.notifyDeploymentSelected}
        />
      </div>
    )
  }

  renderRightSide(){
    return(
      <div className={ls.halfScreePanelRight}>
        <TopLoader isFetching={this.state.isRightFetching}/>
        { this.decideRightSideContent() }
      </div>
    )
  }

  decideRightSideContent(){
    const gitConcluded = [GIT_STATES.CONNECTED, GIT_STATES.NOT_CONNECTED];
    if(this.state.githubState === GIT_STATES.CHECKING)
      return <CenterLoader/>;
    else if(this.state.githubState === GIT_STATES.SHOWING_OFFER)
      return(
        <GithubAuth
          authUrl={this.state.authUrl}
          notifyGithubConcluded={this.notifyGithubConcluded}/>
      );
    else if(gitConcluded.includes(this.state.githubState))
      return this.renderMatchingPreview();
  }

  renderMatchingPreview(){
    return(
      <Fragment>
        <TopLoader isFetching={this.state.isRightFetching}/>
        <MatchPreview
          deployment={this.selectedDeployment()}
          onDeploymentReviewed={this.onDeploymentReviewed}
          isReviewComplete={this.isSubmitReady()}
          submitFunction={this.submit}
          hasGithub={this.state.githubState === GIT_STATES.CONNECTED}
          isSubmitted={this.state.areAllSubmitted}
          isSubmitting={this.state.isSubmitting}
          setIsFetching={(v) => this.setState((s) => ({...s, isRightFetching: v}))}
          notifyCheckChanged={this.notifyCheckChanged}
        />
      </Fragment>
    )
  }

  selectedDeployment(){
    if(this.state.selectedIndex !== null)
      return this.state.deployments[this.state.selectedIndex];
    else return null;
  }

  onDeploymentReviewed(name, bundle){
    const deployments = this.state.deployments.map((d) => {
      if(d.name === name)
        return { ...d, ms: bundle, isReviewed: true };
      else return d;
    });
    const selectedIndex = this.state.selectedIndex + 1;
    this.setState((s) => ({...s, deployments, selectedIndex}));
  }

  isSubmitReady(){
    if(this.state.selectedIndex != null && this.state.deployments != null){
      const checkedDeps = this.state.deployments.filter((d) => d.isChecked);
      const reviewedMap = checkedDeps.map((d) => d.isReviewed);
      return !reviewedMap.includes(false);
    } else return false;
  }

  fetchGithubAuth(){
    this.setState((s) => ({...s, githubState: GIT_STATES.CHECKING}));
    Backend.fetchJson('/github/token', (payload) => {
      const githubState = payload['access_token'] ? GIT_STATES.CONNECTED : GIT_STATES.SHOWING_OFFER;
      const authUrl = payload['auth_url'];
      this.setState((s) => ({...s, githubState, authUrl}));
      if(payload['access_token']) this.fetchClusterDeploys();
    });
  }

  fetchClusterDeploys(){
    this.setState((s) => ({...s, isFetching: true}));
    KubeHandler.fetchJson('/api/deployments', (payload) => {
      const bundle = { isChecked: true, isReviewed: false };
      const deployments = payload['data'].map((d) => ({...d, ...bundle}));
      const selectedIndex = deployments.length > 0 ? 0 : null;
      this.setState((s) => ({...s, deployments, isFetching: false, selectedIndex}));
    });
  }

  notifyGithubConcluded(status){
    const state = status ? GIT_STATES.CONNECTED : GIT_STATES.NOT_CONNECTED;
    this.setState((s) => ({...s, githubState: state}));
  }

  notifyCheckAllChanged(value){
    const deployments = this.state.deployments.map((d) => ({
      ...d, isChecked: value
    }));
    this.setState((s) => ({...s, deployments}));
  }

  notifyCheckChanged(name){
    const deployments = this.state.deployments.map((d) => {
      if(d.name === name) return {...d, isChecked: !d.isChecked};
      return d;
    });
    this.setState((s) => ({...s, deployments}));
  }

  notifyDeploymentSelected(name){
    const selectedIndex = this.state.deployments.findIndex(
      (d) => (d.name === name)
    );
    this.setState((s) => ({...s, selectedIndex}))
  }

  submit(){
    if(this.state.isSubmitting) return;
    this.setState((s) => ({...s, isSubmitting: true}));
    const checkedDeps = this.state.deployments.filter((d) => d.isChecked);

    let formatted = checkedDeps.map((deployment) => ({
      deployment_name: deployment.name,
      repo_name: deployment.ms.repoName,
      ms_name: deployment.ms.msName,
      ms_desc: deployment.ms.msDescription,
      ms_framework: deployment.ms.msFramework
    }));

    const payload = { data: formatted };
    Backend.postJson('/microservices/', payload, (result) => {
      this.setState((s) => ({...s, isSubmitting: false, areAllSubmitted: true}));
    });
  }
}

const Matching = AuthenticatedComponent.compose(
  MatchingClass
);

export { Matching as default };