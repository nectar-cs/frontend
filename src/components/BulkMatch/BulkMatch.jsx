//@flow
import React from 'react';
import AuthenticatedComponent from '../../hocs/AuthenticatedComponent';
import LeftHeader from '../../widgets/LeftHeader/LeftHeader';
import DeploymentList from './DeploymentList';
import MatchModal from '../../modals/MatchModal/MatchModal';
import IntegrationsPrompt from "./IntegrationsPrompt";
import ErrComponent from "../../hocs/ErrComponent";
import ModalHostComposer from "../../hocs/ModalHostComposer";
import {ROUTES} from "../../containers/RoutesConsts";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import Layout from "../../assets/layouts";
import Loader from "../../assets/loading-spinner";
import defaults from './defaults'
import Helper from './Helper'
import type {Matching, WideDeployment} from "../../types/Types";

class BulkMatchingClass extends React.Component<Props, State> {
  constructor(props){
    super(props);
    this.state = BulkMatchingClass.defaultState();
    this.update = this.update.bind(this);
    this.onDeploymentReviewed = this.onDeploymentReviewed.bind(this);
    this.notifyDeploymentSelected = this.notifyDeploymentSelected.bind(this);
  }

  componentDidMount(){
    Helper.fetchIsIntegrated(this.update);
    Helper.fetchItems(this.update);
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
      <Layout.LeftPanel>
        <LeftHeader {...defaults.header} />
        { this.renderDeploymentsList() }
      </Layout.LeftPanel>
    )
  }

  renderRightSide(){
    return(
      <Layout.RightPanel>
        { this.renderIntegrationsPrompt() }
        { this.renderMatchingModal() }
      </Layout.RightPanel>
    )
  }

  renderDeploymentsList(){
    return(
      <DeploymentList
        deployments={this.state.deployments}
        selectedIndex={this.state.selectedIndex}
        notifyDeploymentSelected={this.notifyDeploymentSelected}
      />
    )
  }

  renderIntegrationsPrompt(){
    if(this.state.isIntegrated !== false) return null;
    return <IntegrationsPrompt callback={this.onIntegrationDone}/>;
  }

  renderOfferSubmit(){
    if(!this.isSubmitReady()) return;
    if(this.state.isSubmitting) return;
    if(this.state.areAllSubmitted) return;

    return(
      <CenterAnnouncement
        action={this.submit}
        iconName='done'
        text="Review Complete. Click to commit."
      />
    )
  }

  renderSubmitted(){
    if(!this.state.areAllSubmitted) return;

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

    return(
      <MatchModal
        mode='tutorial'
        deployment={this.selectedDeployment()}
        onDeploymentReviewed={this.onDeploymentReviewed}
        matching={null}
      />
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
      return this.state.selectedIndex === this.state.deployments.length;
    } else return false;
  }

  onIntegrationDone(status, hash){
    if(status){
      const { hasGitRemote, hasImageRegistry } = hash;
      const integrations = {hasGitRemote, hasImageRegistry};
      this.setState((s) => ({...s, integrations }));
    } else window.location = ROUTES.workspaces.index.path;
  }

  notifyDeploymentSelected(name){
    const selectedIndex = this.state.deployments.findIndex(
      (d) => (d.name === name)
    );
    this.setState((s) => ({...s, selectedIndex}))
  }

  update(assignment){
    this.setState(s => ({...s, ...assignment}));
  }

  static defaultState(){
    return({
      deployments: [],
      matchings: [],
      isIntegrated: null,
      authUrl: null,
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
  phase: 'fetching' | 'integrating' | 'submitting'
};

type Props = {};