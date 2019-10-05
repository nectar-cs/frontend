import React from 'react';
import PropTypes from 'prop-types'
import MiscUtils from '../../../utils/MiscUtils';
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";
import HttpActionsModal from "../../../modals/HttpActionsModal/HttpActionsModal";
import PortActionsModal from "../../../modals/PortActionsModal/PortActionsModal";
import CardRow from "./CardRow";
import {Types} from "../../../types/Deployment";
import ImageActionsModal from "../../../modals/ImageActionsModal/ImageActionsModal";
import { S } from "./DeploymentCardStyles"

export default class DeploymentCard extends React.Component {

  render(){
    return(
      <S.Card>
        { this.renderHeader() }
        { this.renderContentRows() }
        { this.renderPodStatuses() }
      </S.Card>
    )
  }

  componentDidMount(){
    // if(this.props.deployment.name === 'news-crawl'){
    //   const bun = {
    //     deployment: this.props.deployment,
    //     matching: this.props.microservice
    //   };
    //   this.props.openModal(ImageActionsModal, bun)
    // }
  }

  renderHeader(){
    const dep = this.props.deployment;
    const ms  = this.props.microservice;
    let frameworkImg = MiscUtils.msImage(dep, ms);
    let git = this.hasGit() ? MiscUtils.gitSummary(ms) : null;
    const subtitle = git || "Not connected to Git";

    return(
      <S.Header>
        <S.HeaderImage src={frameworkImg} alt='Language'/>
        <a href={this.detailPath()}>
          <S.HeaderTitle>{dep.name}</S.HeaderTitle>
        </a>
        <S.HeaderSubtitle>{subtitle}</S.HeaderSubtitle>
      </S.Header>
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

    return <S.ContentRows>
      <tbody>
        { this.buildRow('Image', dep.imageName, imageAction) }
       { this.buildRow('Ports', portText, PortActionsModal) }
        { this.buildRow('Dns', svc.shortDns, dnsAction) }
        { this.buildRow(ipLabel, ipText, ipAction) }
      </tbody>
    </S.ContentRows>;
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
    const pods = this.props.deployment.pods;
    const comps = pods.map(p => <S.PodCircle emotion={p.state} key={p.name}/>);
    return <S.PodStatusesBox>{ comps }</S.PodStatusesBox>;
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