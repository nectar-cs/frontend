import React, {Fragment} from 'react'
import s from './WorkspaceDepsPreview.sass'
import PropTypes from 'prop-types'
import WorkspaceForm from "./WorkspaceForm";

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
    this.fetchDeployments();
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

  fetchDeployments(){
    // const ns = this.props.namespaces;
    // const nsFilterType = `ns_filter_type=${ns.filterType}`;
    // const nsFilter = ns.filters.join(',');
    //
    // const lb = this.props.namespaces;
    // const lbFilterType = `lb_filter_type=${lb.filterType}`;
    // const lbFilter = lb.filters.join(',');
    //
    // const base = '/api/deployments/filtered';
    // const args = `${nsFilterType}&${nsFilter}&${lbFilterType}&${lbFilter}`;
    // const endpoint = `${base}?${args}`;

    // console.log(args);
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
        <th><p>Name</p></th>
        <th><p>Namespace</p></th>
        <th><p>Labels</p></th>
      </tr>
    )
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string),
    namespace: PropTypes.string
  }
}
