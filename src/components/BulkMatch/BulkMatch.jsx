//@flow
import React, {Fragment} from 'react';
import AuthenticatedComponent from '../../hocs/AuthenticatedComponent';
import LeftHeader from '../../widgets/LeftHeader/LeftHeader';
import DeploymentList from './DeploymentList';
import MatchModal from '../../modals/MatchModal/MatchModal';
import IntegrationsPrompt from "./IntegrationsPrompt";
import ErrComponent from "../../hocs/ErrComponent";
import ModalHostComposer from "../../hocs/ModalHostComposer";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import Layout from "../../assets/layouts";
import Loader from "../../assets/loading-spinner";
import defaults from './defaults'
import Helper from './Helper'
import type {Matching, WideDeployment} from "../../types/Types";
import {Redirect} from "react-router";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import MiscUtils from "../../utils/MiscUtils";

class BulkMatchingClass extends React.Component<Props, State> {
  constructor(props){
    super(props);
    this.state = BulkMatchingClass.defaultState();
    this.update = this.update.bind(this);
    this.onIntegrationDone = this.onIntegrationDone.bind(this);
    this.onDeploymentSelected = this.onDeploymentSelected.bind(this);
    this.onMatchingEvent = this.onMatchingEvent.bind(this);
  }

  componentDidMount(){
    MiscUtils.mp("Bulk Matching Start", {});
    this.reload();
  }

  render(){
    return(
      <React.Fragment>
        { this.renderSkipAhead() }
        { this.renderObtLoading() }
        { this.renderEmptyCluster() }
        { this.renderLeftSide() }
        { this.renderRightSide() }
      </React.Fragment>
    )
  }

  renderSkipAhead(){
    if(!this.state.skipRequested) return null;
    return <Redirect to='/workspaces'/>
  }

  renderEmptyCluster() {
    if(this.isIntChecking()) return null;
    if(!this.hasPassedIntCheck()) return null;
    if(!this.isClusterTrivial()) return null;

    return(
      <CenterAnnouncement
        text='No deployments found in your cluster...'
        iconName='search'
      />
    )
  }

  renderObtLoading(){
    if(!this.isIntChecking()) return null;

    return(
      <Fragment>
        <Layout.LeftPanel><CenterLoader/></Layout.LeftPanel>
        <Layout.RightPanel><CenterLoader/></Layout.RightPanel>
      </Fragment>
    )
  }

  renderLeftSide(){
    if(this.isIntChecking()) return null;
    if(this.isClusterTrivial()) return null;

    return(
      <Layout.LeftPanel>
        <LeftHeader {...defaults.header} />
        { <Loader.TopRightSpinner there={this.state.isFetching} /> }
        { this.renderDeploymentsList() }
      </Layout.LeftPanel>
    )
  }

  renderRightSide(){
    if(this.isIntChecking()) return null;
    if(this.isClusterTrivial()) return null;

    return(
      <Layout.RightPanel>
        { this.renderIntegrationsPrompt() }
        { this.renderMatchingModal() }
        { this.renderSubmitted() }
      </Layout.RightPanel>
    )
  }

  renderDeploymentsList(){
    if(!this.hasPassedIntCheck()) return null;
    const { deployments, matchings, selectedIndex } = this.state;

    return(
      <DeploymentList
        deployments={deployments}
        matchings={matchings}
        selectedIndex={selectedIndex}
        callback={this.onDeploymentSelected}
      />
    )
  }

  renderIntegrationsPrompt(){
    if(this.hasPassedIntCheck()) return null;
    return <IntegrationsPrompt callback={this.onIntegrationDone}/>;
  }

  renderSubmitted(){
    const { selectedIndex, deployments } = this.state;
    if(selectedIndex !== deployments.length) return null;

    return(
      <CenterAnnouncement
        contentType='nav-link'
        action='/workspaces'
        iconName='done_all'
        text="All done. Click to continue."
      />
    )
  }

  renderMatchingModal(){
    if(!this.state.isIntegrated) return null;
    if(this.state.isSubmitting) return null;
    if(!this.selectedDeployment()) return null;

    const { matchings } = this.state;
    const deployment = this.selectedDeployment();
    const matching = MiscUtils.depMatching(deployment.name, matchings);

    return(
      <MatchModal
        mode='tutorial'
        deployment={deployment}
        matching={matching}
        callback={this.onMatchingEvent}
      />
    )
  }

  selectedDeployment(){
    if(this.state.selectedIndex !== null)
      return this.state.deployments[this.state.selectedIndex];
    else return null;
  }

  onMatchingEvent(positive){
    if(positive) this.reloadMatchings();
    const selectedIndex = this.state.selectedIndex + 1;
    this.setState((s) => ({...s, selectedIndex}));
  }

  onIntegrationDone(status){
    if(status) this.reload();
    else this.setState(s => ({...s, skipRequested: true}));
  }

  onDeploymentSelected(name){
    const { deployments } = this.state;
    const selectedIndex = deployments.findIndex(d => d.name === name);
    this.setState((s) => ({...s, selectedIndex}))
  }

  reload(){
    this.update({isFetching: true});
    Helper.fetchIsIntegrated(this.update);
    Helper.fetchDeployments(this.update);
    Helper.fetchMatchings(this.update);
    this.update({isFetching: false});
  }

  update(assignment){ this.setState(s => ({...s, ...assignment})); }
  reloadMatchings(){ Helper.fetchMatchings(this.update); }
  hasPassedIntCheck(){ return !!this.state.isIntegrated; }
  isIntChecking(){ return !!this.state.isCheckingIntegration; }
  isClusterTrivial() { return this.state.deployments.length === 0 }

  static defaultState(){
    return({
      deployments: [],
      matchings: [],
      isIntegrated: null,
      isCheckingIntegration: false,
      selectedIndex: 0,
      isSubmitting: false,
      areAllSubmitted: false,
      query: DEFAULT_QUERY,
      integrations: null,
      isOverriding: false
    })
  }
}

const DEFAULT_QUERY = [{
  field: "namespace",
  op: "one-of",
  challenge: ["default"]
}];

const BulkMatch = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      BulkMatchingClass
    )
  )
);

export { BulkMatch as default };

type State = {
  deployments: Array<WideDeployment>,
  matchings: Array<Matching>,
  isIntegrated: ?boolean,
  isCheckingIntegration: ?boolean,
  skipRequested: false,
  phase: 'fetching' | 'integrating' | 'submitting'
};

type Props = {};