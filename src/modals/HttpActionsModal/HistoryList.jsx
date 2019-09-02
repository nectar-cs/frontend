import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";
import s from "./HistoryList.sass";
import MiscUtils from "../../utils/MiscUtils";

export default class HistoryList extends React.Component {

  constructor(props){
    super(props);
    this._isMounted = true;
    this.state = { history: [], isExpanded: false };
    props.historyCallbackSetter(() => this.reloadHistory());
  }

  render(){
    return(
      <Fragment>
        { this.renderToggle() }
        { this.renderContent() }
      </Fragment>
    )
  }

  renderToggle(){
    const t = this.state.isExpanded;
    const change = () => this.setState(s => ({...s, isExpanded: !s.isExpanded}));
    const text = t ? 'Hide history' : 'Prefill from history';
    return(
      <div className={s.historyToggleLine} onClick={change}>
        <p className={s.historyLabel}>{text}</p>
        <i className={`${s.expand} material-icons`}>arrow_right</i>
      </div>
    )
  }

  renderContent(){
    if(this.state.isExpanded){
      return(
        <table className={s.table}>
          <tbody>
          { this.renderItems() }
          </tbody>
        </table>
      )
    } else return null;
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

  static propTypes = {
    name: PropTypes.string.isRequired,
    namespace: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
  }
}

class HistoryRow extends React.Component {

  render(){

    let { path, host, verb, status, senderNs, senderType } = this.props;
    host = host.replace("http://", "");
    let statusClass = MiscUtils.statusCodeColors(status);

    return(
      <tr className={s.wholeRow} onClick={this.props.callback}>
        <td className={s.row}><p>{host}{path}</p></td>
        <td className={s.row}><p className={s.verb}>{verb}</p></td>
        <td className={s.row}><p>{senderNs} / {senderType}</p></td>
        <td className={s.row}><p className={`${s.verb} ${statusClass}`}>{status}</p></td>
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
      <th><p>Address</p></th>
      <th><p>Verb</p></th>
      <th><p>Sender</p></th>
      <th><p>Outcome</p></th>
    </tr>
  )
}