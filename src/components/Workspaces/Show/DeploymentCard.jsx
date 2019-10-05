import React from 'react';
import PropTypes from 'prop-types'
import MiscUtils from '../../../utils/MiscUtils';
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";
import HttpActionsModal from "../../../modals/HttpActionsModal/HttpActionsModal";
import CardRow from "./CardRow";
import {Types} from "../../../types/Deployment";
import ImageActionsModal from "../../../modals/ImageActionsModal/ImageActionsModal";
import { S } from "./DeploymentCardStyles"
import DepSourceModal from "../../../modals/DepSourceModal/DepSourceModal";

export default class DeploymentCard extends React.Component {

  constructor(props){
    super(props);
    this.openImageModal = this.openImageModal.bind(this);
    this.openSourceModal = this.openSourceModal.bind(this);
  }

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
    if(this.props.deployment.name === 'news-crawl'){
      this.openSourceModal();
    }
  }

  renderHeader(){
    const dep = this.props.deployment;
    const ms  = this.props.matching;
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
    return !!this.props.matching;
  }

  hasGit(){
    return this.hasMs() && this.props.matching.gitRemoteName;
  }

  renderContentRows(){
    const dep = this.props.deployment;
    const svc = this.props.deployment.services[0];

    const dnsMaterial = svc.externalIp ? 'language' : null;
    const portText = `${svc.toPort} <- ${svc.fromPort}`;
    const dnsAction = () => this.openHttpModal(svc.shortDns);

    return <S.ContentRows>
      <tbody>
        { this.buildRow('Image', dep.imageName, this.openImageModal) }
        { this.buildRow('Source', this.sourceString(), this.openSourceModal) }
        { this.buildRow('Quick DNS', svc.shortDns, dnsAction, dnsMaterial) }
        { this.buildRow('Ports', portText, null) }
      </tbody>
    </S.ContentRows>;
  }

  sourceString(){
    const dep = this.props.deployment;
    if(dep.statedBranch && dep.statedCommit){
      const commitPart = `"${dep.statedCommit.substring(0, 10)}"...`;
      return `${dep.statedBranch}: ${commitPart}`;
    } else return "Not annotated :(";
  }

  openHttpModal(text){
    const svc = this.props.deployment.services[0];
    const bundle = {
      deployment: this.props.deployment,
      matching: this.props.matching,
      targetHost: text,
      port: svc.fromPort
    };

    this.props.openModal(HttpActionsModal, bundle);
  }

  openImageModal(){
    const bundle = {
      deployment: this.props.deployment,
      matching: this.props.matching,
      refreshCallback: this.props.refreshCallback
    };
    this.props.openModal(ImageActionsModal, bundle);
  }

  openSourceModal(){
    const { deployment, matching, replaceModal } = this.props;
    let bundle = {deployment, matching, replaceModal};
    this.props.openModal(DepSourceModal, bundle);
  }

  buildRow(label, text, openModalFunc, material){
    return(
      <CardRow
        label={label}
        text={text}
        getDeployment={() => this.props.deployment}
        openModal={openModalFunc}
        material={material}
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
    matching: Types.Matching,
    openModal: PropTypes.func.isRequired,
    refreshCallback: PropTypes.func.isRequired
  };
}