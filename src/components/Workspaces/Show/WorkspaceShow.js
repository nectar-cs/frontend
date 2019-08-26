import React from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import ErrComponent from "../../../hocs/ErrComponent";

class WorkspaceShowClass extends React.Component{
  render(){
    return <p>SHOW {this.props.match['id']}</p>
  }
}

const WorkspaceShow = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      WorkspaceShowClass
    )
  )
);

export default WorkspaceShow;