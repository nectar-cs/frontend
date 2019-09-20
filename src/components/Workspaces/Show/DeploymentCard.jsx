import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentCard.sass'
import MiscUtils from '../../../utils/MiscUtils';
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";
import HttpActionsModal from "../../../modals/HttpActionsModal/HttpActionsModal";
import PortActionsModal from "../../../modals/PortActionsModal/PortActionsModal";
import CardRow from "./CardRow";
import {FULL_DEPLOYMENT, Types} from "../../../types/Deployment";
import ImageActionsModal from "../../../modals/ImageActionsModal/ImageActionsModal";

export default class DeploymentCard extends React.Component {

  render(){
    return(
      <div className={s.card}>
        { this.renderHeader() }
        { this.renderContentRows() }
        { this.renderPodStatuses() }
      </div>
    )
  }

  componentDidMount(){
    // if(this.props.deployment.name === 'ruby-cluster'){
    //   const bun = { deployment: this.props.deployment };
    //   this.props.openModal(ImageActionsModal, bun)
    // }
  }

  renderHeader(){
    const dep = this.props.deployment;
    const ms  = this.props.microservice;
    let frameworkName = ms ? ms.framework : 'docker';
    let frameworkImg = MiscUtils.frameworkImage(frameworkName);
    let git = this.hasGit() ? `${ms.gitRemoteName} / ${ms.gitRepoName}` : null;
    const subtitle = git || "Not connected to Git";

    return(
      <div className={s.header}>
        <img className={s.headerImage} src={frameworkImg} alt='Language'/>
        <a href={this.detailPath()}><p className={s.headerTitle}>{dep.name}</p></a>
        <p className={s.headerSubtitle}>{subtitle}</p>
      </div>
    )
  }

  hasMs(){
    return !!this.props.microservice;
  }

  hasGit(){
    return this.hasMs() && this.props.microservice.gitRemoteName;
  }

  renderContentRows(){
    const dep = this.props.deployment;
    const svc = this.props.deployment.services[0];

    const ipLabel = `Internal${svc.externalIp ? ', External' : ''} IP`;
    const ipText = `${svc.internalIp}${svc.externalIp ? `, ${svc.externalIp}` : ''}`;
    const portText = `${svc.toPort} <- ${svc.fromPort}`;
    const dnsAction = () => this.openHttpModal(svc.shortDns);
    const ipAction = () => this.openHttpModal(svc.internalIp);
    const imageAction = () => this.openImageModal();

    return <table className={s.contentRows}>
      <tbody>
        { this.buildRow('Image', dep.imageName, imageAction) }
        { this.buildRow('Ports', portText, PortActionsModal) }
        { this.buildRow('Dns', svc.shortDns, dnsAction) }
        { this.buildRow(ipLabel, ipText, ipAction) }
      </tbody>
    </table>;
  }

  openHttpModal(text){
    const svc = this.props.deployment.services[0];
    const bundle = {
      deployment: this.props.deployment,
      matching: this.props.microservice,
      targetHost: text,
      port: svc.fromPort
    };

    this.props.openModal(HttpActionsModal, bundle);
  }

  openImageModal(){
    const bundle = {
      deployment: this.props.deployment,
      matching: this.props.microservice,
      refreshCallback: this.props.refreshCallback
    };
    this.props.openModal(ImageActionsModal, bundle);
  }

  buildRow(label, text, openModalFunc){
    return(
      <CardRow
        label={label}
        text={text}
        getDeployment={() => this.props.deployment}
        openModal={openModalFunc}
      />
    )
  }

  renderPodStatuses() {
    const rows = this.props.deployment.pods.map((pod) => {
      const statusCol = `podStatus${pod.state || "Unknown"}`;
      return (
        <div className={`${s.podCircle} ${s[statusCol]}`} key={pod.name}/>
      )
    });
    return <div className={s.podStatusesBox}>{ rows }</div>;
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
    deployment: Types.Deployment,
    microservice: Types.Matching,
    openModal: PropTypes.func.isRequired,
    refreshCallback: PropTypes.func.isRequired
  };
}