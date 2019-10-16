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
import {connect} from "react-redux";

class WorkspaceShowClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      deployments: [],
      microservices: [],
      selectedIndex: 0,
      isEntered: false,
      isFetching: false
    };
    this.fetchDeployments = this.fetchDeployments.bind(this);
    this.repeater = this.repeater.bind(this);
  }

  componentDidMount() {
    this.setState((s) => ({...s, isFetching: true}));
    this.fetchMatchings();
  }

  componentWillReceiveProps(nextProps){
    if(!this.props.workspace){
      if(nextProps.workspace){
        Helper.fetchDeployments(this, nextProps);
      }
    }
  }

  render(){
    console.log("NOW WS");
    console.log(this.props.workspace);
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
    const workspace = this.props.workspace;
    const name = workspace ? workspace.name : this.workspaceId();

    const parts = [
      { name: "Workspaces", url: "/workspaces" },
      { name: name, url: `/workspaces/${this.workspaceId()}/edit` }
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
    const { openModal, replaceModal} = this.props;

    const cards = this.state.deployments.map((deployment) => (
      <DeploymentCard
        selectableKey={deployment.name}
        key={deployment.name}
        deployment={deployment}
        matching={this.matchingForDep(deployment)}
        openModal={openModal}
        replaceModal={replaceModal}
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

  matchingForDep(deployment){
    return this.state.microservices.find((matching) => (
      matching.deploymentName === deployment.name
    ));
  }

  workspaceId(){
    return this.props.match.params['id'];
  }

  fetchDeployments(){ Helper.fetchDeployments(this); }
  fetchMatchings(){ Helper.fetchMatchings(this); }

  repeater(){
    this.fetchDeployments();
    setTimeout(this.repeater, 8000);
  }
}

function s2P(state, props){
  const {workspaces} = state.mainReducer;
  const target = props.match.params['id'].toString();
  const finder = (ws) => ws.id.toString() === target;
  const workspace = workspaces.find(finder);
  return { workspace };
}

const connected = connect(s2P)(WorkspaceShowClass);

const WorkspaceShow = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      connected
    )
  )
);

export default WorkspaceShow;