import React from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import ErrComponent from "../../../hocs/ErrComponent";
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";
import CenterCard from "../../../widgets/CenterCard/CenterCard";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";
import Backend from "../../../utils/Backend";
import {ROUTES} from "../../../containers/RoutesConsts";

class WorkspaceIndexClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      workspaces: [],
      isLoading: false
    }
  }

  componentDidMount(){
    Backend.fetchJson('/workspaces', (payload) => {
      this.setState((s) => ({...s, workspaces: payload['data']}));
    });
  }

  render(){
    if(this.state.isLoading){
      return <CenterLoader/>
    } else if(this.state.workspaces.length > 0){
      return <p>There's content!</p>
    } else if(this.state.workspaces.length === 0){
      return WorkspaceIndexClass.renderEmpty();
    }
  }

  static renderEmpty(){
    return(
      <CenterCard>
        <CenterAnnouncement
          iconName='add'
          text="Workspaces help organize your apps. Create one."
          contentType="nav-link"
          routeTo={ROUTES.workspaces.new.path}
        />
      </CenterCard>
    )
  }
}

const WorkspaceIndex = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      WorkspaceIndexClass
    )
  )
);

export default WorkspaceIndex;