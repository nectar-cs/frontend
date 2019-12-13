import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Backend from '../../utils/Backend';
import DataUtils from '../../utils/DataUtils';
import s from './HistoryList.sass';
import Utils from '../../utils/Utils';

export default class HistoryList extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = { history: [], isExpanded: false };
    props.historyCallbackSetter(() => this.reloadHistory());
  }

  render() {
    return (
      <Fragment>
        {this.renderToggle()}
        {this.renderContent()}
      </Fragment>
    );
  }

  renderToggle() {
    const t = this.state.isExpanded;
    const change = () => this.setState(s => ({ ...s, isExpanded: !s.isExpanded }));
    const text = t ? 'Hide history' : 'Prefill from history';
    return (
      <div className={s.historyToggleLine} onClick={change}>
        <p className={s.historyLabel}>{text}</p>
        <i className={`${s.expand} material-icons`}>arrow_right</i>
      </div>
    );
  }

  renderContent() {
    if (this.state.isExpanded) {
      return (
        <table className={s.table}>
          <tbody>{this.renderItems()}</tbody>
        </table>
      );
    } else return null;
  }

  renderItems() {
    return this.state.history.map(h => (
      <HistoryRow
        key={h['id']}
        id={h['id']}
        {...h['extras']}
        callback={this.props.onItemSelectedCallback}
      />
    ));
  }

  componentDidMount() {
    this.reloadHistory();
  }

  reloadHistory() {
    let args = `dep_name=${this.props.name}`;
    args = `${args}&dep_namespace=${this.props.namespace}`;
    args = `${args}&kind=http_requests`;
    Backend.aFetch(`/dep_attachments?${args}`, resp => {
      if (this._isMounted) {
        this.setState(s => ({
          ...s,
          history: DataUtils.obj2Camel(resp['data']),
        }));
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    namespace: PropTypes.string.isRequired,
    onItemSelectedCallback: PropTypes.func.isRequired,
  };
}

class HistoryRow extends React.Component {
  shortenVerb(verb) {
    if (verb.toLowerCase() === 'delete') verb = 'del';
    else if (verb.toLowerCase() === 'patch') verb = 'ptch';
    else if (verb.toLowerCase() === 'options') verb = 'opts';

    return verb.toUpperCase();
  }

  render() {
    let { source, destination, status, bodyText, headerText } = this.props;
    let { type, namespace } = source;
    let { path, host, verb } = destination;
    const back = { source, destination, bodyText, headerText };

    host = host.replace('http://', '');
    const Td = p => <td className={s.row}>{p.children}</td>;
    const statCol = Utils.statusCodeColors(status);
    const verbCol = Utils.httpVerbColors(verb);
    const callback = () => this.props.callback(back);
    verb = this.shortenVerb(verb);

    return (
      <tr className={s.wholeRow} onClick={callback}>
        <Td>
          <p className={s.url}>
            {host}
            {path}
          </p>
        </Td>
        <Td>
          <p className={`${s.verb} ${verbCol}`}>{verb}</p>
        </Td>
        <Td>
          <p>
            {namespace} / {type}
          </p>
        </Td>
        <Td>
          <p className={`${s.verb} ${statCol}`}>{status}</p>
        </Td>
      </tr>
    );
  }

  static propTypes = {
    destination: PropTypes.shape({
      path: PropTypes.string.isRequired,
      verb: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired,
    }).isRequired,
    source: PropTypes.shape({
      namespace: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    headerText: PropTypes.string,
    headerBody: PropTypes.string,
    lastStatus: PropTypes.number,
    historyCallbackSetter: PropTypes.func.isRequired,
  };
}
