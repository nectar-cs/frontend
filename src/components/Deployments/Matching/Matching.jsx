import React from 'react';
import AuthenticatedComponent from '../../../hocs/AuthenticatedComponent';
import ls from '../../../assets/content-layouts.sass';
import {LeftHeader, ICON} from '../../../widgets/LeftHeader/LeftHeader';
import Backend from '../../../utils/Backend';
import DeploymentList from './DeploymentList';
import TopLoader from '../../../widgets/TopLoader/TopLoader';
import MatchPreview from './MatchPreview';
import { Redirect } from 'react-router';
import { ROUTES } from '../../../containers/RoutesConsts';
import DataUtils from '../../../utils/DataUtils';
import KubeHandler from "../../../utils/KubeHandler";

const GIT_STATES = { CHECKING: 'checking', OKAY: 'offer', INVALID: 'waiting' };

const Header = function(){
  return(
    <LeftHeader
      title='Match Deployments to Repos'
      subtitle='System setup wizard'
      graphicType={ICON}
      graphicName='search'
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
      areAllSubmitted: false
    };

    this.onDeploymentReviewed = this.onDeploymentReviewed.bind(this);
    this.fetchClusterDeploys = this.fetchClusterDeploys.bind(this);
    this.submit = this.submit.bind(this);
    this.applications = [];
  }

  render(){
    if(this.state.githubState === GIT_STATES.OKAY){
      return this.renderMainContent();
    } else if(this.state.githubState === GIT_STATES.CHECKING){
      return <p>Waiting...</p>;
    } else if(this.state.githubState === GIT_STATES.INVALID) {
      return <Redirect to={ROUTES.team.githubAuth.path}/>
    } else return null;
  }

  componentDidMount(){
    this.setState((s) => ({...s, githubState: GIT_STATES.CHECKING}));
    Backend.fetchJson('/github/token', (payload) => {
      const gState = payload['access_token'] ? GIT_STATES.OKAY : GIT_STATES.INVALID;
      this.setState((s) => ({...s, githubState: gState}));
      if(payload['access_token']) this.fetchClusterDeploys();
    });
  }

  renderMainContent(){
    return(
      <React.Fragment>
        <div className={ls.halfScreePanelLeft}>
          <Header/>
          <TopLoader isFetching={this.state.isFetching}/>
          <DeploymentList
            selectedIndex={this.state.selectedIndex}
            deployments={this.bundleDeployments()}
          />
        </div>
        <div className={ls.halfScreePanelRight}>
          <TopLoader isFetching={this.state.isRightFetching}/>
          <MatchPreview
            deployment={this.selectedDeployment()}
            onDeploymentReviewed={this.onDeploymentReviewed}
            isReviewComplete={this.isSubmitReady()}
            submitFunction={this.submit}
            isSubmitted={this.state.areAllSubmitted}
            isSubmitting={this.state.isSubmitting}
            setIsFetching={(v) => this.setState((s) => ({...s, isRightFetching: v}))}
          />
        </div>
      </React.Fragment>
    )
  }

  fetchClusterDeploys(){
    KubeHandler.fetchJson('/api/deployments', (payload) => {
      const items = payload['data'];
      const ind = items.length > 0 ? 0 : null;
      this.setState((s) => ({...s,
        deployments: items,
        isFetching: false,
        selectedIndex: ind
      }));
    });
  }

  bundleDeployments(){
    return this.state.deployments.map((deployment, i) => {
      if(this.state.selectedIndex === i){
        return {...deployment, isSelected: true};
      } else if(this.applications[i]){
        return {...deployment, status: this.applications[i].status};
      } else {
        return {...deployment, status: 'pending'};
      }
    });
  }

  selectedDeployment(){
    if(this.state.selectedIndex !== null)
      return this.state.deployments[this.state.selectedIndex];
    else return null;
  }

  onDeploymentReviewed(bundle){
    const newIndex = this.state.selectedIndex + 1;
    this.applications.push(bundle);
    this.setState((s) => ({...s, selectedIndex: newIndex}))
  }

  isSubmitReady(){
    if(this.state.selectedIndex){
      return this.applications.length === this.state.deployments.length;
    } else return false;
  }

  submit(){
    if(this.state.isSubmitting) return;
    this.setState((s) => ({...s, isSubmitting: true}));

    let formatted = this.applications.map((a, i) => ({...a,
      k_pointer: this.state.deployments[i].name,
      repo_id: a.repoId
    }));

    formatted = formatted.filter((a) => a.status === 'accepted');

    formatted.forEach((e) => {
      delete e.repoId;
      delete e.status;
    });

    const payload = { data: formatted };

    Backend.postJson('/sys_objects/', payload, (result) => {
      this.setState((s) => ({...s, isSubmitting: false, areAllSubmitted: true}));
      console.log("[submit] submitted");
    });
  }
}

const Matching = AuthenticatedComponent.compose(
  MatchingClass
);

export { Matching as default };