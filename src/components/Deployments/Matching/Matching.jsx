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
import {theme} from "../../../assets/constants";
import {ThemeProvider} from "styled-components";
import {ROUTES} from "../../../containers/RoutesConsts";
import DataUtils from "../../../utils/DataUtils";

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
      <ThemeProvider theme={theme}>
        <React.Fragment>
          { this.renderLeftSide() }
          { this.renderRightSide() }
        </React.Fragment>
      </ThemeProvider>
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

  renderMatchingPreview(){
    if(!this.state.integrations) return null;

    return(
      <Fragment>
        <MatchPreview
          deployment={this.selectedDeployment()}
          onDeploymentReviewed={this.onDeploymentReviewed}
          isReviewComplete={this.isSubmitReady()}
          submitFunction={this.submit}
          isSubmitted={this.state.areAllSubmitted}
          isSubmitting={this.state.isSubmitting}
          setIsFetching={(v) => this.setState((s) => ({...s, isRightFetching: v}))}
          hasGitRemote={this.state.integrations.hasGitRemote}
          hasImageRegistry={this.state.integrations.hasImageRegistry}
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
      return this.state.selectedIndex === this.state.deployments.length;
    } else return false;
  }

  fetchClusterDeploys(){
    this.setState((s) => ({...s, isFetching: true}));
    Kapi.fetch('/api/deployments/across_namespaces', (payload) => {
      const bundle = { isChecked: true, isReviewed: false };
      const deployments = payload['data'].map((d) => ({...d, ...bundle}));
      const selectedIndex = deployments.length > 0 ? 0 : null;
      this.setState((s) => ({...s, deployments, isFetching: false, selectedIndex}));
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
    this.setState((s) => ({...s, isSubmitting: true}));
    const checkedDeps = this.state.deployments;

    let formatted = checkedDeps.map((deployment) => {
      const {gitRemoteName, gitRepoName} = deployment.ms;
      const {imgRemoteName, imgRepoName} = deployment.ms;
      const {framework} = deployment.ms;

      return {
        deploymentName: deployment.name, framework,
        gitRemoteName, gitRepoName,
        imgRemoteName, imgRepoName,
      }
    });

    const payload = { data: DataUtils.objKeysToSnake(formatted) };
    Backend.postJson('/microservices/', payload, (_) => {
      this.setState((s) => ({...s, isSubmitting: false, areAllSubmitted: true}));
    });
  }
}

const DEFAULT_QUERY = [{field: "namespace", op: "one-of", challenge: ["default"]}];

const Header = function(){
  return(
    <LeftHeader
      title='Deployment Matching'
      subtitle='Match your deployments to your git and docker repos'
      graphicType={ICON}
      graphicName='developer_board'
    />
  )
};

const Matching = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      MatchingClass
    )
  )
);

export { Matching as default };