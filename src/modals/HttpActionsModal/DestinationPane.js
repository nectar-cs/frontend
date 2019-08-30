import React, {Fragment} from "react";
import PropTypes from 'prop-types'
import s from './DestinationPane.sass'
import MiscUtils from "../../utils/MiscUtils";
import {Service} from "../../types/Deployment";

export default class DestinationPane extends React.Component {

  render(){
    return(
      <Fragment>
        <div className={s.inputLine}>
          <p className={s.label}>Target Host</p>
          <select
            className={s.fullLineInput}
            value={this.props.host}
            onChange={(e) => this.broadcastChange('host', e)}>
            { this.hostOptions() }
          </select>
        </div>
        <div className={s.inputLine}>
          <p className={s.label}>Path and Verb</p>
          <input
            className={s.pathInput}
            value={this.props.path}
            onChange={(e) => this.broadcastChange('path', e)}
          />
          <select
            className={s.verbSelect}
            value={this.props.verb}
            onChange={(e) => this.broadcastChange('verb', e)}>
            { DestinationPane.verbOptions() }
          </select>
        </div>
      </Fragment>
    )
  }

  static verbOptions(){
    return MiscUtils.arrayOptions([
      'GET', 'POST'
    ]);
  }

  hostOptions(){
    const rawArray = this.props.services.map(svc => [
      `http://${svc.shortDns}:${svc.fromPort}`,
      `http://${svc.longDns}:${svc.fromPort}`,
      `http://${svc.internalIp}:${svc.fromPort}`,
      svc.externalIp ? `http://${svc.externalIp}:${svc.fromPort}` : null,
    ]);

    const cleanedArray = rawArray.flat().filter(e => e);
    return MiscUtils.arrayOptions(cleanedArray);
  }

  broadcastChange(field, event){
    const assignment = { [field]: event.target.value };
    this.props.onFieldChanged(assignment)
  }

  static propTypes = {
    onFieldChanged: PropTypes.func.isRequired,
    host: PropTypes.string,
    path: PropTypes.string,
    verb: PropTypes.oneOf(['GET', 'POST']),
    services: PropTypes.arrayOf(Service)
  }
}