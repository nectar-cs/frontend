import React, {Fragment} from 'react';
import AuthenticatedComponent from '../../../hocs/AuthenticatedComponent';
import ls from '../../../assets/content-layouts.sass';
import LeftHeader, { ICON} from '../../../widgets/LeftHeader/LeftHeader';
import Backend from '../../../utils/Backend';
import DeploymentList from './DeploymentList';
import TopLoader from '../../../widgets/TopLoader/TopLoader';
import MatchPreview from './MatchPreview';
import Kapi from "../../../utils/Kapi";
import IntegrationsPrompt from "./IntegrationsPrompt";
import ErrComponent from "../../../hocs/ErrComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import {ROUTES} from "../../../containers/RoutesConsts";
import DataUtils from "../../../utils/DataUtils";
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";

class MatchingClass extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isFetching: false,
      isRightFetching: false,
      isIntegrated: false,
      authUrl: null,
      deployments: [],
      selectedIndex: null,
      isSubmitting: false,
      areAllSubmitted: false,
      query: DEFAULT_QUERY,
      integrations: null
    };

    this.onDeploymentReviewed = this.onDeploymentReviewed.bind(this);
    this.fetchClusterDeploys = this.fetchClusterDeploys.bind(this);
    this.submit = this.submit.bind(this);
    this.onIntegrationDone = this.onIntegrationDone.bind(this);
    this.notifyDeploymentSelected = this.notifyDeploymentSelected.bind(this);
  }

  componentDidMount(){
    this.fetchClusterDeploys();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.hasKubeError){
      this.setState((s) => ({...s, isFetching: false}))
    }
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
          notifyDeploymentSelected={this.notifyDeploymentSelected}
        />
      </div>
    )
  }

  renderRightSide(){
    return(
      <div className={ls.halfScreePanelRight}>
        <TopLoader isFetching={this.state.isRightFetching}/>
        <Fragment>
          { this.renderIntegrationsPrompt() }
          { this.renderMatchingPreview() }
          { this.renderOfferSubmit() }
          { this.renderSubmitted() }
        </Fragment>
      </div>
    )
  }

  renderIntegrationsPrompt(){
    if(this.state.integrations) return null;

    return(
      <IntegrationsPrompt
        authUrl={this.state.authUrl}
        notifyIntegrationDone={this.onIntegrationDone}
        openModal={this.props.openModal}
      />
    );
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


  renderMatchingPreview(){
    if(!this.state.integrations) return null;
    if(this.state.isSubmitting) return null;
    if(!this.selectedDeployment()) return null;

    const sif = (v) => this.setState((s) => ({...s, isRightFetching: v}));
    return(
      <MatchPreview
        deployment={this.selectedDeployment()}
        onDeploymentReviewed={this.onDeploymentReviewed}
        setIsFetching={sif}
        hasGitRemote={this.state.integrations.hasGitRemote}
        hasImageRegistry={this.state.integrations.hasImageRegistry}
      />
    )
  }

  selectedDeployment(){
    if(this.state.selectedIndex !== null)
      return this.state.deployments[this.state.selectedIndex];
    else return null;
  }

  onDeploymentReviewed(name, bundle){
    // if(this.state.isSubmitting) return;
    console.log("CALLED");
    console.log(bundle);
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

  fetchClusterDeploys(){
    this.setState((s) => ({...s, isFetching: true}));
    Kapi.fetch('/api/deployments/across_namespaces', (payload) => {
      const bundle = { isChecked: true, isReviewed: false };
      const deployments = payload['data'].map((d) => ({...d, ...bundle}));
      const selectedIndex = deployments.length > 0 ? 0 : null;
      this.setState((s) => ({
        ...s,
        deployments,
        isFetching: false,
        selectedIndex
      }));
    }, this.props.kubeErrorCallback);
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

  submit(){
    if(this.state.isSubmitting || this.props.hasKubeError) return;
    const deps = this.state.deployments.filter(d => d.ms);

    let formatted = deps.map((deployment) => {
      const {gitRemoteName, gitRepoName} = deployment.ms;
      const {imgRemoteName, imgRepoName} = deployment.ms;
      const {framework} = deployment.ms;

      return {
        deploymentName: deployment.name,
        namespaces: deployment.namespaces,
        gitRemoteName, gitRepoName,
        imgRemoteName, imgRepoName,
        framework
      }
    });

    console.table(formatted);
    const payload = { data: DataUtils.objKeysToSnake(formatted) };

    this.setState((s) => ({...s, isSubmitting: true}));

    Backend.raisingPost(`/microservices`, payload, () => {
      this.setState((s) => ({...s,
        isSubmitting: false,
        areAllSubmitted: true
      }));
    });
  }
}

const DEFAULT_QUERY = [
  {
    field: "namespace",
    op: "one-of",
    challenge: ["default"]
  }
];

function Header(){
  return(
    <LeftHeader
      title='Deployment Matching'
      subtitle='Match your deployments to your git and docker repos'
      graphicType={ICON}
      graphicName='developer_board'
    />
  )
}

const Matching = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      MatchingClass
    )
  )
);

export { Matching as default };