//@flow
import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import ErrComponent from "../../../hocs/ErrComponent";
import WorkspaceDepsPreview from "./WorkspaceDepsPreview";
import Kapi from "../../../utils/Kapi";
import ModalButton from "../../../widgets/Buttons/ModalButton";
import Backend from "../../../utils/Backend";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";
import DoneAnnouncement from "./DoneAnnouncement";
import Layout from "../../../assets/layouts";
import ConfigurationSide from "./ConfigurationSide";

class WorkspaceEditClass extends React.Component<State, Props> {

  constructor(props){
    super(props);
    this.state = {
      isFetching: true,
      isReloadingDeployments: false,
      isSubmitting: false,
      deployments: [],
      namespaces: [],
      labels: [],
      workspace: {
        name: '',
        nsFilters: [],
        lbFilters: [],
        nsFilterType: 'whitelist',
        lbFilterType: 'blacklist'
      }
    };

    this.update = this.update.bind(this);
    this.submit = this.submit.bind(this);
  }

  async componentDidMount(){
    this.fetchPossibilities();
  }

  render(){
    return(
      <Fragment>
        { this.renderLeftSide() }
        { this.renderRightSide() }
        { this.renderInitialLoading() }
        { this.renderDone() }
      </Fragment>
    );
  }

  renderDone(){
    return <DoneAnnouncement id={this.id()} name={this.state.name} />
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

  update(changes) {
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
        if (this.id()){
          Backend.raisingFetch(`/workspaces/${this.id()}/`, r3 => {
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
      isDefault: (wipResp['is_default'] || false).toString(),
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

  submit(){
    this.setState((s) => ({...s, submit: 'submitting'}));
    const endpoint = `/workspaces/${this.id() ? this.id() : ''}`;
    const method = this.id() ? 'PATCH' : 'POST';

    const payload = {
      name: this.state.workspaceName,
      is_default: this.state.isDefault,
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

  id(){ return this.props.match.params['id']; }
  onSubmitFailed(){ alert("Some bad happened"); }
}

type Props = {

};

type State = {

};

const WorkspaceEdit = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      WorkspaceEditClass
    )
  )
);

export default WorkspaceEdit;