import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";
import s from "./HistoryList.sass";

export default class HistoryList extends React.Component {

  constructor(props){
    super(props);
    this._isMounted = true;
    this.state = { history: [] };
    props.historyCallbackSetter(() => this.reloadHistory());
  }

  render(){
    return(
      <Fragment>
        <div className={s.historyToggleLine}>
          <p className={s.historyLabel}>History</p>
          <i className={`${s.expand} material-icons`}>arrow_right</i>
        </div>
        <table className={s.table}>
          <tbody>
            <HistoryHeaderRow/>
            { this.renderItems() }
            </tbody>
        </table>
      </Fragment>
    )
  }

  renderItems(){
    return this.state.history.map(h => (
      <HistoryRow {...h['extras']} />
    ));
  }

  componentDidMount(){
    this.reloadHistory();
  }

  reloadHistory(){
    let args = `dep_name=${this.props.name}`;
    args = `${args}&dep_namespace=${this.props.namespace}`;
    args = `${args}&kind=http_requests`;
    Backend.raisingFetch(`/dep_attachments?${args}`, (resp) => {
      if(this._isMounted)
        this.setState(s => ({
          ...s,
          history: DataUtils.objKeysToCamel(resp['data'])
        }))
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  propTypes = {
    name: PropTypes.string.isRequired,
    namespace: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
  }
}

class HistoryRow extends React.Component {

  render(){
    return(
      <tr>
        <td><p>{this.props.path}</p></td>
        <td><p>{this.props.host}</p></td>
        <td><p>{this.props.verb}</p></td>
        <td><p>200</p></td>
        <td><p>default/test-pod</p></td>
      </tr>
    )
  }

  static propTypes = {
    path: PropTypes.string.isRequired,
    verb: PropTypes.string.isRequired,
    headers: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.string,
    lastStatus: PropTypes.number,
    historyCallbackSetter: PropTypes.func.isRequired
  };
}

function HistoryHeaderRow() {
  return(
    <tr>
      <th><p>Path</p></th>
      <th><p>Address</p></th>
      <th><p>Verb</p></th>
      <th><p>Outcome</p></th>
      <th><p>Sender</p></th>
    </tr>
  )
}