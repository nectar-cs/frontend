import React, {Fragment} from 'react'
import s from './WorkspaceDepsPreview.sass'
import PropTypes from 'prop-types'
import WorkspaceForm from "./WorkspaceForm";
import KubeHandler from "../../../utils/KubeHandler";

export default class WorkspaceDepsPreview extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isFetching: false,
      deployments: []
    };
  }

  componentDidMount(){
    this.fetchDeployments();
  }

  componentWillReceiveProps(nextProps){
    console.log("NEW PROPS");
    let changeOccurred = false;
    const crtProps = this.props;

    ['namespaces', 'labels'].forEach((bundle) => {
      ['filters', 'filterType'].forEach((field) => {
        if(crtProps[bundle][field] !== crtProps[bundle][field]){
          console.log("INEQ " + crtProps[bundle][field] + " != " + nextProps[bundle][field]);
          changeOccurred = true;
        }
      });
    });

    // if (changeOccurred){
      console.log("PROP CHANGE");
      this.fetchDeployments(nextProps);
    // }
  }

  render(){
    return (
      <Fragment>
        <h4 className={s.title}>Preview</h4>
        <p>The following deployments will appear in your workspace:</p>
        <table className={s.table}>
          <tbody>
          <ListHeader/>
          { this.renderRows() }
          </tbody>
        </table>
      </Fragment>
    )
  }

  renderRows(){
    return this.state.deployments.map((deployment) => (
      <Row {...deployment} />
    ));
  }

  fetchDeployments(props=this.props){
    const ns = props.namespaces;
    const nsFilterType = `ns_filter_type=${ns.filterType}`;
    const nsFilter = `ns_filters=${ns.filters.join(',')}`;

    const lb = props.labels;
    const lbFilterType = `lb_filter_type=${lb.filterType}`;
    const lbFilter = `lb_filters=${lb.filters.join(',')}`;

    const base = '/api/deployments/filtered';
    const args = `${nsFilterType}&${nsFilter}&${lbFilterType}&${lbFilter}`;
    const endpoint = `${base}?${args}`;

    KubeHandler.raisingFetch(endpoint, (response) => {
      this.setState((s) => ({...s, deployments: response['data']}));
    });
  }

  static propTypes = {
    namespaces: WorkspaceForm.itemPropTypes,
    labels:  WorkspaceForm.itemPropTypes
  }
}

function ListHeader(){
  return(
    <tr>
      <th><p>Name</p></th>
      <th><p>Namespace</p></th>
      <th><p>Labels</p></th>
    </tr>
  )
}

class Row extends React.Component{
  render(){
    return(
      <tr>
        <td><p>{this.props.name}</p></td>
        <td><p>{this.props.namespace}</p></td>
        <td>{this.renderLabels()}</td>
      </tr>
    )
  }

  renderLabels() {
    const labels = Object.keys(this.props.labels).map((k) => (
      `${k}:${this.props.labels[k]}`
    ));

    return labels.map((label) => (
      <p key={label} className={s.statusTag}>{label}</p>
    ));
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string),
    namespace: PropTypes.string
  }
}
