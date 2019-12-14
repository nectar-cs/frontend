import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Types } from '../../types/CommonTypes';
import Utils from '../../utils/Utils';
import s from './DestinationPane.sass';

const HTTP_VERBS = ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'];

export default class DestinationPane extends React.Component {
  render() {
    return (
      <Fragment>
        <div className={s.inputLine}>
          <p className={s.label}>Target Host</p>
          <select
            className={s.fullLineInput}
            value={this.props.host}
            onChange={e => this.broadcastChange('host', e)}
          >
            {this.hostOptions()}
          </select>
        </div>
        <div className={s.inputLine}>
          <p className={s.label}>Path and Verb</p>
          <input
            className={s.pathInput}
            value={this.props.path}
            onChange={e => this.broadcastChange('path', e)}
          />
          <select
            className={s.verbSelect}
            value={this.props.verb}
            onChange={e => this.broadcastChange('verb', e)}
          >
            {Utils.arrayOptions(HTTP_VERBS)}
          </select>
        </div>
      </Fragment>
    );
  }

  hostOptions() {
    const { services, pods } = this.props;

    const serviceOptions = services
      .map(svc => [
        DestinationPane.makeSvcHost(svc.name, svc.shortDns, svc.fromPort),
        DestinationPane.makeSvcHost(svc.name, svc.longDns, svc.fromPort),
        DestinationPane.makeSvcHost(svc.name, svc.internalIp, svc.fromPort),
        DestinationPane.makeSvcHost(svc.name, svc.externalIp, svc.fromPort),
      ])
      .flat();

    const podOptions = pods.map(pod => DestinationPane.makePodHost(pod.name, pod.ip));

    const combined = [...serviceOptions, ...podOptions];
    const cleaned = combined.filter(e => e);
    return Utils.arrayOfHashesOptions(cleaned);
  }

  static makeSvcHost(name, domain, port) {
    if (domain && port) {
      const key = `http://${domain}:${port}`;
      return { value: key, show: `${key} (Service ${name})` };
    }
    return null;
  }

  static makePodHost(name, domain) {
    if (domain) {
      const key = `http://${domain}`;
      return { value: key, show: `${key} (Pod ${name})` };
    }
    return null;
  }

  broadcastChange(field, event) {
    const assignment = { [field]: event.target.value };
    this.props.onFieldChanged(assignment);
  }

  static propTypes = {
    onFieldChanged: PropTypes.func.isRequired,
    host: PropTypes.string,
    path: PropTypes.string,
    verb: PropTypes.oneOf(HTTP_VERBS),
    services: PropTypes.arrayOf(Types.Service),
    pods: PropTypes.arrayOf(Types.LightPod),
  };
}
