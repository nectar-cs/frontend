import React, {Fragment} from 'react'
import {S} from './WorkspaceShowStyles'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import ErrComponent from "../../../hocs/ErrComponent";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";
import DeploymentCard from "./DeploymentCard";
import Helper from "./Helper";
import Breadcrumbs from "../../../widgets/Breadcrumbs/Breadcrumbs";

class WorkspaceShowClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      workspace: null,
      deployments: [],
      microservices: [],
      selectedIndex: 0,
      isEntered: false,
      isFetching: false
    };
    this.fetchDeployments = this.fetchDeployments.bind(this);
  }

  componentDidMount() {
    this.setState((s) => ({...s, isFetching: true}));
    this.fetchDeployments();
    this.fetchMatchings();
  }

  render(){
    return(
      <Fragment>
        { this.renderLoading() }
        { this.renderCards() }
        { this.renderEmpty() }
        { this.renderBreadcrumbs() }
      </Fragment>
    );
  }

  renderBreadcrumbs(){
    const workspace = this.state.workspace;
    const name = workspace ? workspace.name : this.workspaceId();

    const parts = [
      { name: "Workspaces", url: "/workspaces" },
      { name: name, url: `/workspaces/${this.workspaceId()}` }
    ];

    return <Breadcrumbs parts={parts}/>
  }

  renderLoading(){
    if(!this.state.isFetching) return null;
    return <CenterLoader/>;
  }

  renderEmpty(){
    if(this.state.isFetching) return null;
    if(this.state.deployments.length > 0) return null;
    const pathBase = ROUTES.workspaces.edit.path;
    const editPath = makeRoute(pathBase, { id: this.workspaceId() });

    return(
      <CenterAnnouncement
        contentType='nav-link'
        text="No Deployments. Edit your filters."
        iconName='search'
        action={editPath}
      />
    )
  }

  renderCards(){
    if(this.state.isFetching) return null;

    const cards = this.state.deployments.map((deployment) => (
      <DeploymentCard
        selectableKey={deployment.name}
        key={deployment.name}
        deployment={deployment}
        matching={this.microserviceForDeployment(deployment)}
        openModal={this.props.openModal}
        replaceModal={this.props.replaceModal}
        refreshCallback={this.fetchDeployments}
      />
    ));

    return(
      <div>
        <S.CardGrid>
          { cards }
        </S.CardGrid>
      </div>
    )
  }

  microserviceForDeployment(deployment){
    return this.state.microservices.find((microservice) => (
      microservice.deploymentName === deployment.name
    ));
  }

  workspaceId(){
    return this.props.match.params['id'];
  }

  fetchDeployments(){ Helper.fetchDeployments(this); }
  fetchMatchings(){ Helper.fetchMatchings(this); }
}

const WorkspaceShow = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      WorkspaceShowClass
    )
  )
);

export default WorkspaceShow;