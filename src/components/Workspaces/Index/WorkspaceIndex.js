//@flow
import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import ErrComponent from "../../../hocs/ErrComponent";
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";
import CenterCard from "../../../widgets/CenterCard/CenterCard";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";
import Backend from "../../../utils/Backend";
import { ROUTES} from "../../Root/RoutesConsts";
import { Button, Layout} from 'ui-common'
import { Redirect} from "react-router-dom";
import type {Workspace} from "../../../types/Types";
import Utils from "../../../utils/Utils";
import {WorkspaceHeader, WorkspaceRow} from "./WorkspaceRow";

class WorkspaceIndexClass extends React.Component<Props, State>{

  constructor(props){
    super(props);
    this.state = {
      workspaces: [],
      isLoading: false,
      redirectTo: null
    };
    this.promptDelete = this.promptDelete.bind(this);
  }

  async componentDidMount(): void{
    document.title = `Workspaces`;
    this.setState(s => ({...s, isLoading: true}));
    const workspaces = await Backend.bFetch('/workspaces');
    this.setState((s) => ({...s, isLoading: false, workspaces }));
  }

  render(){
    return(
      <Fragment>
        { this.renderRedirect() }
        { this.renderLoading() }
        { this.renderMainContent() }
        { this.renderEmpty() }
        { this.renderAddButton() }
      </Fragment>
    )
  }

  renderRedirect(){
    if(!this.state.redirectTo) return null;
    return <Redirect to={this.state.redirectTo}/>;
  }

  renderAddButton(){
    const redirectTo = ROUTES.workspaces.new.path;
    const callback = () => this.setState(s => ({...s, redirectTo}));
    const Btn = Button.FloatingPlus;
    return<Btn onClick={callback}>+</Btn>;
  }

  renderLoading(){
    if(!this.state.isLoading) return null;
    return(
      <Layout.FullWidthPanel>
        <CenterLoader/>
      </Layout.FullWidthPanel>
    )
  }

  renderMainContent(){
    if(this.state.workspaces.length < 1) return null;

    return(
      <Layout.FullScreen>
        <table>
          <tbody>
          <WorkspaceHeader/>
          { this.renderWorkspacesList() }
          </tbody>
        </table>
      </Layout.FullScreen>
    )
  }

  renderWorkspacesList(){
    return this.state.workspaces.map(workspace =>
      <WorkspaceRow
        key={workspace.id}
        workspace={workspace}
        deleteCallback={this.promptDelete}
      />
    );
  }

  renderEmpty(){
    if(this.state.isLoading) return null;
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

  promptDelete(workspaceId){
    const bundle = ROUTES.workspaces;
    if(window.confirm("Are you sure?")){
      const ep = `/workspaces/${workspaceId}`;
      Utils.mp("Workspace Delete", {});
      Backend.aDelete(ep, () => {
        window.location = bundle.index.path;
      });
    }
  }
}

type Props = {};
type State = {
  workspaces: Array<Workspace>,
  redirectTo: string,
  isLoading: boolean
}

const WorkspaceIndex = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      WorkspaceIndexClass
    )
  )
);

export default WorkspaceIndex;