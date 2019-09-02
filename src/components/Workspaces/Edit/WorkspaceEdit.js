import React from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import ErrComponent from "../../../hocs/ErrComponent";
import ls from "../../../assets/content-layouts.sass";
import TopLoader from "../../../widgets/TopLoader/TopLoader";
import LeftHeader, {ICON} from "../../../widgets/LeftHeader/LeftHeader";
import WorkspaceForm from "./WorkspaceForm";
import WorkspaceDepsPreview from "./WorkspaceDepsPreview";
import s from './WorkspaceEdit.sass'
import {explanation} from "./copy";
import Kapi from "../../../utils/Kapi";
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
    this.fetchPossibilities();
  }

  wip(){
    return this.props.match.params['id'];
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

    Kapi.fetch(ep1, (r1) => {
      Kapi.fetch(ep2, (r2) => {
        if (this.wip()){
          Backend.raisingFetch(`/workspaces/${this.wip()}/`, r3 => {
            this.onAllFetched(r1, r2, r3);
          });
        }
        else this.onAllFetched(r1, r2);
      });
    }, this.props.kubeErrorCallback);
  }

  onAllFetched(nsResp, lbResp, wipResp={}){
    this.setState(s => ({...s,
      isFetching: false,
      workspaceName: wipResp['name'],
      namespaces: {
        filters: wipResp['ns_filters'] || s.namespaces.filters,
        filterType: wipResp['ns_filter_type'] || s.namespaces.filterType,
        possibilities: nsResp['data']
      },
      labels: {
        filters: wipResp['lb_filters'] || s.labels.filters,
        filterType: wipResp['lb_filter_type'] || s.labels.filterType,
        possibilities: lbResp['data']
      }
    }));
  }

  onSubmitFailed(error){

  }

  submitWorkspace(){
    this.setState((s) => ({...s, submit: 'submitting'}));
    const endpoint = `/workspaces/${this.wip() ? this.wip() : ''}`;
    const method = this.wip() ? 'PATCH' : 'POST';

    const payload = {
      name: this.state.workspaceName,
      ns_filter_type: this.state.namespaces.filterType,
      ns_filters: this.state.namespaces.filters,
      lb_filter_type: this.state.labels.filterType,
      lb_filters: this.state.labels.filters
    };

    const onSuccess = (response) => {
      this.setState(s => ({...s, submit: 'done', wip: response.data.id}));
    };

    Backend.raisingRequest(
      method,
      endpoint,
      { workspace: payload },
      onSuccess,
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