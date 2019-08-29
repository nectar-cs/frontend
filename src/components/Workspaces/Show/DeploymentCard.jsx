import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentCard.sass'
import MiscUtils from '../../../utils/MiscUtils';
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";
import HttpActionsModal from "../../../modals/HttpActionsModal/HttpActionsModal";
import PortActionsModal from "../../../modals/PortActionsModal/PortActionsModal";
import CardRow from "./CardRow";
import {FULL_DEPLOYMENT} from "../../../types/Deployment";

export default class DeploymentCard extends React.Component {

  render(){
    return(
      <div className={s.card}>
        { this.renderHeader() }
        { this.renderContentRows() }
        <div className={s.podStatusesBox}>
          { this.renderPodStatuses() }
        </div>
      </div>
    )
  }

  renderHeader(){
    const dep = this.props.deployment;
    let frameworkImg = MiscUtils.frameworkImage('docker');
    return(
      <div className={s.header}>
        <img className={s.headerImage} src={frameworkImg} alt='Language'/>
        <a href={this.detailPath()}><p className={s.headerTitle}>{dep.name}</p></a>
        <p className={s.headerSubtitle}>Not connected to Git</p>
      </div>
    )
  }

  renderContentRows(){
    const dep = this.props.deployment;
    const svc = this.props.deployment.services[0];

    const ipLabel = `Internal${svc.externalIp ? ', External' : ''} IP`;
    const ipText = `${svc.internalIp}${svc.externalIp ? `, ${svc.externalIp}` : ''}`;
    const portText = `${svc.toPort} <- ${svc.fromPort}`;

    return <table className={s.contentRows}>
      <tbody>
        { this.buildRow('Image', dep.imageName) }
        { this.buildRow('Ports', portText, PortActionsModal) }
        { this.buildRow('Dns', svc.shortDns, HttpActionsModal) }
        { this.buildRow(ipLabel, ipText, HttpActionsModal) }
      </tbody>
    </table>;
  }

  buildRow(label, text, modalClass){
    return(
      <CardRow
        label={label}
        text={text}
        modalClass={modalClass}
        getDeployment={() => this.props.deployment}
        openModal={this.props.openModal}
      />
    )
  }

  renderPodStatuses(){
    return this.props.deployment.pods.map((pod) => {
      const statusCol = `podStatus${pod.state || "Unknown"}`;
      return(
        <div className={`${s.podCircle} ${s[statusCol]}`} key={pod.name}/>
      )
    });
  }

  detailPath(){
    return makeRoute(
      ROUTES.deployments.show.path, {
        id: this.props.deployment.name,
        ns: this.props.deployment.namespace
      }
    )
  }

  static propTypes = {
    openModal: PropTypes.func.isRequired,
    ...FULL_DEPLOYMENT
  };

}