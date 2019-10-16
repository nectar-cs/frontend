import React, {Fragment} from 'react'
import s from './WorkspaceDepsPreview.sass'
import PropTypes from 'prop-types'
import Kapi from "../../../utils/Kapi";
import Loader from "../../../assets/loading-spinner";

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
    if (nextProps.filtersChanged){
      this.fetchDeployments(nextProps);
    }
  }

  render(){
    return (
      <Fragment>
        { this.renderLoader() }
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

  renderLoader(){
    if(!this.state.isFetching) return null;
    return <Loader.TopRightSpinner/>;
  }

  renderRows(){
    return this.state.deployments.map((deployment) => (
      <Row {...deployment} key={deployment.name} />
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

    this.setState(s => ({...s, isFetching: true}));
    Kapi.fetch(endpoint, (response) => {
      this.setState((s) => ({...s, deployments: response['data']}));
      this.setState(s => ({...s, isFetching: false}));
    });
  }

  static fieldShape = PropTypes.shape({
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    filterType: PropTypes.string.isRequired,
  });

  static propTypes = {
    filtersChanged: PropTypes.bool.isRequired,
    namespaces: WorkspaceDepsPreview.fieldShape,
    labels:  WorkspaceDepsPreview.fieldShape
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
    const {name,  namespace} = this.props;
    return(
      <tr>
        <td><p>{name}</p></td>
        <td><p>{namespace}</p></td>
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
    labels: PropTypes.object.isRequired,
    namespace: PropTypes.string
  }
}
