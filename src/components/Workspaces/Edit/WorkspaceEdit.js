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
import KubeHandler from "../../../utils/KubeHandler";

class WorkspaceEditClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isFetching: false,
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
    this.fetchPossibilities()
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
    const nsBundle = {
      filters: this.state.namespaces.filters,
      filterType: this.state.namespaces.filterType
    };

    const lbBundle = {
      filters: this.state.labels.filters,
      filterType: this.state.labels.filterType
    };

    return(
      <div className={ls.halfScreePanelRight}>
        <TopLoader isFetching={false}/>
        <WorkspaceDepsPreview
          namespaces={nsBundle}
          labels={lbBundle}
        />
      </div>
    )
  }

  onFieldsChanged(changes) {
    this.setState((s) => ({...s, ...changes}));
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
}

const WorkspaceEdit = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    ErrComponent.compose(
      WorkspaceEditClass
    )
  )
);

export default WorkspaceEdit;