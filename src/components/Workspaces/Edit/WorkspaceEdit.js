//@flow
import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import ErrComponent from "../../../hocs/ErrComponent";
import WorkspaceDepsPreview from "./WorkspaceDepsPreview";
import DoneAnnouncement from "./DoneAnnouncement";
import { CenterLoader, Layout, ModalButton } from "nectar-cs-js-common";
import ConfigurationSide from "./ConfigurationSide";
import Helper from "./Helper";
import type {Deployment, Workspace} from "../../../types/Types";
import Utils from "../../../utils/Utils";

class WorkspaceEditClass extends React.Component<Props, State> {

  constructor(props){
    super(props);
    this.state = {
      isFetching: true,
      isReloadingDeployments: false,
      isSubmitting: false,
      isDone: false,
      deployments: [],
      namespaces: [],
      labels: [],
      workspace: defaultWorkspace
    };

    this.update = this.update.bind(this);
    this.submit = this.submit.bind(this);
    this.updateWorkspace = this.updateWorkspace.bind(this);
  }

  async componentDidMount(): void{
    this.reloadNamespacesAndLabels();
    this.reloadWorkspace();
  }

  render(){
    return(
      <Fragment>
        { this.renderInitialLoading() }
        { this.renderLeftSide() }
        { this.renderRightSide() }
        { this.renderDone() }
      </Fragment>
    );
  }

  renderInitialLoading(){
    const { isFetching, isSubmitting } = this.state;
    if(!isFetching || isSubmitting) return null;

    return(
      <Layout.FullWidthPanel>
        <CenterLoader/>
      </Layout.FullWidthPanel>
    )
  }

  renderLeftSide(){
    const {  workspace, isFetching, isSubmitting } = this.state;
    const { namespaces, labels } = this.state;
    if(isFetching || isSubmitting) return null;

    return(
      <Layout.LeftPanel>
        <ConfigurationSide
          namespaces={namespaces}
          labels={labels}
          workspace={workspace}
          isFetching={isFetching}
          callback={this.updateWorkspace}
        />
      </Layout.LeftPanel>
    );
  }

  renderRightSide(){
    const { isReloadingDeployments, deployments  } = this.state;
    const { isFetching, isSubmitting  } = this.state;
    if(isFetching || isSubmitting) return null;

    return(
      <Layout.RightPanel>
        <WorkspaceDepsPreview
          isFetching={isReloadingDeployments}
          deployments={deployments}
        />
        <ModalButton
          callback={this.submit}
          title='Save'
          isEnabled={!isSubmitting}
        />
      </Layout.RightPanel>
    )
  }

  renderDone(){
    if(!this.state.isDone) return null;

    return(
      <DoneAnnouncement
        id={this.id()}
        name={this.state.workspace.name}
      />
    )
  }

  update(changes) {
    const { workspace: oldWorkspace } = this.state;

    if(Helper.deploymentsNeedReload(changes, oldWorkspace))
      this.reloadDeployments(changes.workspace);

    this.setState((s) => ({...s, ...changes}));
  }

  updateWorkspace(key, value){
    const { workspace: oldWorkspace } = this.state;
    const workspace = { ...oldWorkspace, [key]: value };
    this.update({workspace});
  }

  async reloadNamespacesAndLabels(){
    this.update({isFetching: true});
    const namespaces = await Helper.fetchNamespaces();
    const labels = await Helper.fetchLabels();
    this.update({namespaces, labels, isFetching: false});
  }

  async reloadDeployments(newWorkspace){
    this.update({isReloadingDeployments: true});
    const sourceOfTruth = newWorkspace || this.state.workspace;
    const filterBundle = Helper.coreWorkspace(sourceOfTruth);
    const deployments = await Helper.fetchDeployments(filterBundle);
    this.update({deployments, isReloadingDeployments: false});
  }

  async reloadWorkspace(){
    if(this.id()){
      this.update({isFetching: true});
      const workspace = await Helper.fetchWorkspace(this.id());
      this.update({workspace, isFetching: false});
    }
  }

  async submit(){
    this.mpTrack();
    this.update({isSubmitting: true});
    const { workspace: editedWorkspace } = this.state;
    const workspace = await Helper.patchOrPostWorkspace(editedWorkspace);
    this.update({workspace, isSubmitting: false, isDone: true});
  }

  mpTrack(){
    const verb = this.id() ? "Update" : "Create";
    Utils.mp("Workspace Save", { verb });
  }

  id() {
    const { id: fromModel } = this.state.workspace;
    const { id: fromPath } = this.props.match.params;
    return fromModel || fromPath;
  }
}

type Props = {  };

type State = {
  isDone: boolean,
  namespaces: string[],
  labels: string[],
  workspace: Workspace,
  deployments: Deployment[]
};

const defaultWorkspace = {
  name: '',
  isDefault: false,
  nsFilters: ['default'],
  lbFilters: [],
  nsFilterType: 'whitelist',
  lbFilterType: 'blacklist'
};

const WorkspaceEdit = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      WorkspaceEditClass
    )
  )
);

export default WorkspaceEdit;
