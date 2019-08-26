import React, {Fragment} from 'react'
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
import KubeHandler from "../../../utils/KubeHandler";
import ModalButton from "../../../widgets/Buttons/ModalButton";
import Backend from "../../../utils/Backend";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";

class WorkspaceEditClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      wip: null,
      isFetching: false,
      submit: null,
      filtersChanged: true,
      workspaceName: '',
      namespaces: {
        filters: ['default'],
        filterType: 'whitelist',
        possibilities: []
      },
      labels: {
        filters: [],
        filterType: 'blacklist',
        possibilities: []
      }
    };

    this.onFieldsChanged = this.onFieldsChanged.bind(this);
    this.submitWorkspace = this.submitWorkspace.bind(this);
    this.onSubmitted = this.onSubmitted.bind(this);
  }

  render(){
    if (this.state.submit === null){
      return(
        <React.Fragment>
          { this.renderLeftSide() }
          { this.renderRightSide() }
        </React.Fragment>
      )
    } else if (this.state.submit === 'submitting'){
      return this.renderAllLoading();
    } else if (this.state.submit === 'done'){
      return this.renderDone();
    }
  }

  componentDidMount(){
    this.fetchPossibilities()
  }

  renderDone(){
    const editPath = makeRoute(ROUTES.workspaces.edit.path, {id: this.state.wip});
    const continuePath = makeRoute(ROUTES.workspaces.show.path, {id: this.state.wip});

    return(
      <div className={ls.fullScreen}>
        <CenterAnnouncement
          contentType='children'
          action={ROUTES.workspaces.index.path}
          iconName='done_all'>
          <p className={s.doneText}>{this.state.workspaceName} saved.</p>
          <p className={s.doneText}>
            <a href={editPath}>Keep editing</a>, or, <a href={continuePath}>continue</a>.
          </p>
        </CenterAnnouncement>
      </div>
    )
  }

  renderAllLoading(){
    return(
      <div className={ls.fullScreen}>
        <CenterLoader/>
      </div>
    )
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
        <TopLoader isFetching={this.state.isFetching}/>

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
        <WorkspaceDepsPreview
          namespaces={this.state.namespaces}
          labels={this.state.labels}
          filtersChanged={this.state.filtersChanged}
        />
        <ModalButton
          callback={this.submitWorkspace}
          title='Save'
          isEnabled={this.state.submit === null}
        />
      </div>
    )
  }

  onFieldsChanged(changes) {
    const nsChanged = Object.keys(changes).includes('namespaces');
    const lbChanged = Object.keys(changes).includes('labels');

    this.setState((s) => ({...s,
      ...changes,
      filtersChanged: nsChanged || lbChanged
    }));
  }

  fetchPossibilities(){
    this.setState(s => ({...s, isFetching: true}));
    const ep1 = '/api/cluster/namespaces';
    const ep2 = '/api/cluster/label_combinations';
    KubeHandler.raisingFetch(ep1, (r1) => {
      KubeHandler.raisingFetch(ep2, (r2) => {
        this.setState(s => ({...s,
          isFetching: false,
          namespaces: { ...s.namespaces, possibilities: r1['data'] },
          labels: { ...s.labels, possibilities: r2['data'] }
        }));
      });
    }, this.props.kubeErrorCallback);
  }

  onSubmitted(response){
    this.setState(s => ({...s,
      submit: 'done',
      wip: response.data.id
    }));
  }

  onSubmitFailed(error){

  }

  submitWorkspace(){
    this.setState((s) => ({...s, submit: 'submitting'}));
    const payload = {
      name: this.state.workspaceName,
      ns_filter_type: this.state.namespaces.filterType,
      ns_filters: this.state.namespaces.filters,
      lb_filter_type: this.state.labels.filterType,
      lb_filters: this.state.labels.filters
    };
    Backend.raisingPost(
      '/workspaces',
      { workspace: payload },
      this.onSubmitted,
      this.onSubmitFailed
    )
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