import React from 'react'
import s from './WorkspaceIndex.sass'
import ts from './../../../assets/text-combos.sass'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import ErrComponent from "../../../hocs/ErrComponent";
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";
import CenterCard from "../../../widgets/CenterCard/CenterCard";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";
import Backend from "../../../utils/Backend";
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";
import ColoredLabelList from "../../../widgets/ColoredLabelList/ColoredLabelList";

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
    if(this.state.isLoading){
      return this.renderLoading();
    } else if(this.state.workspaces.length > 0){
      return this.renderMainContent();
    } else if(this.state.workspaces.length === 0){
      return WorkspaceIndexClass.renderEmpty();
    }
  }

  renderLoading(){
    return(
      <div className={s.content}>
        <CenterLoader/>
      </div>
    )
  }

  renderMainContent(){
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

  static renderEmpty(){
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