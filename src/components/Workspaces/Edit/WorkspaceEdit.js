import React from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import ErrComponent from "../../../hocs/ErrComponent";
import ls from "../../../assets/content-layouts.sass";
import TopLoader from "../../../widgets/TopLoader/TopLoader";
import {ICON, LeftHeader} from "../../../widgets/LeftHeader/LeftHeader";
import WorkspaceForm from "./WorkspaceForm";
import WorkspaceDepsPreview from "./WorkspaceDepsPreview";
import s from './WorkspaceEdit.sass'
import {explanation} from "./copy";

const DEFAULT_STATE = {
  filters: [],
  filterType: 'whitelist',
  possibilities: []
};

class WorkspaceEditClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      workspaceName: null,
      namespaces: DEFAULT_STATE,
      labels: DEFAULT_STATE
    };

    this.onFieldsChanged = this.onFieldsChanged.bind(this);
  }

  render(){
    return(
      <React.Fragment>
        { this.renderLeftSide() }
        { this.renderRightSide() }
      </React.Fragment>
    )
  }

  componentDidMount(){
  }

  renderLeftSide(){
    return(
      <div className={ls.halfScreePanelLeft}>
        <LeftHeader
          graphicType={ICON}
          graphicName='developer_board'
          title={this.state.workspaceName || "My New Workspace"}
          subtitle={"Made for organizing"}
          />
        <TopLoader isFetching={false}/>

        <div className={s.introBox}>
          { explanation }
        </div>

        <WorkspaceForm
          onFieldsChanged={this.onFieldsChanged}
          workspaceName={this.state.workspaceName}
          namespaces={this.state.namespaces}
          labels={this.state.labels}
        />
      </div>
    )
  }

  renderRightSide(){
    return(
      <div className={ls.halfScreePanelRight}>
        <TopLoader isFetching={false}/>
        <WorkspaceDepsPreview/>
      </div>
    )
  }

  onFieldsChanged(changes) {
    this.setState((s) => ({...s, ...changes}));
  }

}

const WorkspaceEdit = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      WorkspaceEditClass
    )
  )
);

export default WorkspaceEdit;