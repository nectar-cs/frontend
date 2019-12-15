import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";
import Utils from "../../utils/Utils";
import {Tables} from "ui-common";
import S from './HistoryListStyles'

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
      <S.HistoryToggleLine onClick={change}>
        <S.HistoryLabel>{text}</S.HistoryLabel>
        <S.Expand className='material-icons'>arrow_right</S.Expand>
      </S.HistoryToggleLine>
    )
  }

  renderContent(){
    if(this.state.isExpanded){
      return(
        <Tables.Table low={1}>
          <tbody>
          { this.renderItems() }
          </tbody>
        </Tables.Table>
      )
    } else return null;
  }

  renderItems(){
    return this.state.history.map(h => (
      <HistoryRow
        key={h['id']}
        id={h['id']}
        {...h['extras']}
        callback={this.props.onItemSelectedCallback}
      />
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
      if(this._isMounted) {
        this.setState(s => ({
          ...s,
          history: DataUtils.obj2Camel(resp['data'])
        }))
      }
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    namespace: PropTypes.string.isRequired,
    onItemSelectedCallback: PropTypes.func.isRequired
  }
}

class HistoryRow extends React.Component {

  shortenVerb(verb){
    if(verb.toLowerCase() === 'delete')
      verb = 'del';
    else if(verb.toLowerCase() === 'patch')
      verb = 'ptch';
    else if(verb.toLowerCase() === 'options')
      verb = 'opts';

    return verb.toUpperCase();
  }

  render(){
    let { source, destination, status, bodyText, headerText } = this.props;
    let { type, namespace } = source;
    let { path, host, verb } = destination;
    const back = { source, destination, bodyText, headerText };

    host = host.replace("http://", "");
    const Td = (p) => <Tables.SkinnyRow>{p.children}</Tables.SkinnyRow>;
    const statCol = Utils.statusCodeColors(status);
    const verbCol = Utils.httpVerbColors(verb);
    const callback = () => this.props.callback(back);
    verb = this.shortenVerb(verb);

    return(
      <S.WholeRow onClick={callback}>
        <Td><S.Url>{host}{path}</S.Url></Td>
        <Td><S.Verb emotion={verbCol}>{verb}</S.Verb></Td>
        <Td><p>{namespace} / {type}</p></Td>
        <Td><S.Verb emotion={statCol}>{status}</S.Verb></Td>
      </S.WholeRow>
    )
  }

  static propTypes = {
    destination: PropTypes.shape({
      path: PropTypes.string.isRequired,
      verb: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired
    }).isRequired,
    source: PropTypes.shape({
      namespace: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired,
    headerText: PropTypes.string,
    headerBody: PropTypes.string,
    lastStatus: PropTypes.number,
    historyCallbackSetter: PropTypes.func.isRequired
  };
}