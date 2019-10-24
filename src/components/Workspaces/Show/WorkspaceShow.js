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
import {connect} from "react-redux";
import Backend from "../../../utils/Backend";
import Setter from "../../../utils/StateGulp";

class WorkspaceShowClass extends React.Component{

  static REFRESH_RATE = 10000;

  constructor(props){
    super(props);
    this.state = {
      deployments: null,
      matchings: [],
      selectedIndex: 0,
      isEntered: false,
      isFetching: false
    };

    this._willUnmount = false;
    this.fetchDeployments = this.fetchDeployments.bind(this);
    this.repeater = this.repeater.bind(this);
    this.repeater(false);
  }

  componentDidMount(){
    this.fetchMatchings();
  }

  componentWillUnmount(){
    this._willUnmount = true;
  }

  componentWillReceiveProps(nextProps){
    if(this.state.deployments === null){
      if(nextProps.workspace){
        Helper.fetchDeployments(this, true, nextProps);
      }
    }

    if(this.workspaceId() !== this.workspaceId(nextProps)){
      this.fetchMatchings();
      Helper.fetchDeployments(this, true, nextProps);
    }
  }

  render(){
    return(
      <Fragment>
        { this.renderLoading() }
        { this.renderCards() }
        { this.renderEmpty() }
      </Fragment>
    );
  }

  renderLoading(){
    if(!this.state.isFetching) return null;
    return <CenterLoader/>;
  }

  renderEmpty(){
    const { deployments, isFetching } = this.state;
    if(isFetching || !deployments) return null;
    if(deployments.length > 0) return null;

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
    const { deployments, isFetching } = this.state;
    const { openModal, replaceModal} = this.props;
    if(isFetching || !deployments) return null;

    const Cards = () => deployments.map((deployment) => (
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
      <S.CardGrid>
        <Cards/>
      </S.CardGrid>
    )
  }

  matchingForDep(deployment){
    return this.state.matchings.find((matching) => (
      matching.deploymentName === deployment.name
    ));
  }

  workspaceId(source = this.props){
    return source.match.params['id'];
  }

  fetchDeployments(){ Helper.fetchDeployments(this, false); }
  fetchMatchings(){ Helper.fetchMatchings(this); }

  repeater(immediate=true){
    if(!this._willUnmount){
      if(immediate) this.fetchDeployments();
      setTimeout(this.repeater, WorkspaceShowClass.REFRESH_RATE);
    }
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