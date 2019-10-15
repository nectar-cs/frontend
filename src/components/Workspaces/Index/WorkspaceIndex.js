import React, {Fragment} from 'react'
import s from './WorkspaceIndex.sass'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import ErrComponent from "../../../hocs/ErrComponent";
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";
import CenterCard from "../../../widgets/CenterCard/CenterCard";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";
import Backend from "../../../utils/Backend";
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";
import ColoredLabelList from "../../../widgets/ColoredLabelList/ColoredLabelList";
import Button from "../../../assets/buttons";

class WorkspaceIndexClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      workspaces: [],
      isLoading: false
    }
  }

  componentDidMount(){
    this.setState(s => ({...s, isLoading: true}));
    Backend.raisingFetch('/workspaces', (payload) => {
      this.setState((s) => ({...s, isLoading: false, workspaces: payload['data']}));
    }, this.props.apiErrorCallback);
  }

  render(){
    return(
      <Fragment>
        { this.renderLoading() }
        { this.renderMainContent() }
        { this.renderEmpty() }
        { this.renderAddButton() }
      </Fragment>
    )
  }

  renderAddButton(){
    return(
      <Button.FloatingPlus>
        +
      </Button.FloatingPlus>
    )
  }

  renderLoading(){
    if(!this.state.isLoading) return null;
    return(
      <div className={s.content}>
        <CenterLoader/>
      </div>
    )
  }

  renderMainContent(){
    if(this.state.workspaces.length < 1) return null;

    return(
      <div className={s.content}>
        <table>
          <tbody>
          <WorkspaceHeader/>
          { this.renderWorkspacesList() }
          </tbody>
        </table>
      </div>
    )
  }

  renderWorkspacesList(){
    return this.state.workspaces.map((w) =>
      <WorkspaceRow key={w.id} {...w}/>
    );
  }

  renderEmpty(){
    if(this.state.workspaces.length > 0) return null;

    return(
      <CenterCard>
        <CenterAnnouncement
          iconName='add'
          text="Workspaces help organize your apps. Create one."
          contentType="nav-link"
          action={ROUTES.workspaces.new.path}
        />
      </CenterCard>
    )
  }
}

function WorkspaceHeader() {
  return(
    <tr>
      <th><p>Workspace</p></th>
      <th><p>Namespace Filters</p></th>
      <th><p>Label Filters</p></th>
      <th><p>Actions</p></th>
    </tr>
  )
}

function WorkspaceRow(props) {
  const showPath = makeRoute(ROUTES.workspaces.show.path, {id: props.id});
  const editPath = makeRoute(ROUTES.workspaces.edit.path, {id: props.id});
  return(
    <tr>
      <td><p>
        <a href={showPath}>{props.name}</a>
      </p></td>
      <td>
        <ColoredLabelList
          labelType={props.ns_filter_type}
          labels={props.ns_filters}
        />
      </td>
      <td>
        <ColoredLabelList
          labelType={props.lb_filter_type}
          labels={props.lb_filters}
        />
      </td>
      <td><p>
        <a href={editPath}>Edit</a>
      </p></td>
    </tr>
  )
}

const WorkspaceIndex = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      WorkspaceIndexClass
    )
  )
);

export default WorkspaceIndex;