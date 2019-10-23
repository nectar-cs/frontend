import React from 'react';
import PropTypes from 'prop-types'
import MiscUtils from '../../../utils/MiscUtils';
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";
import HttpActionsModal from "../../../modals/HttpActionsModal/HttpActionsModal";
import CardRow from "./CardRow";
import {Types} from "../../../types/Deployment";
import ImageOpsModal from "../../../modals/ImageActionsModal/ImageOpsModal";
import { S } from "./DeploymentCardStyles"
import DepSourceModal from "../../../modals/DepSourceModal/DepSourceModal";
import PortForwardModal from "../../../modals/PortForwardModal/PortForwardModal";
import CommandsModal from "../../../modals/CommandsModal/CommandsModal";
import {Link} from "react-router-dom";

export default class DeploymentCard extends React.Component {

  constructor(props){
    super(props);
    this.openImageModal = this.openImageModal.bind(this);
    this.openSourceModal = this.openSourceModal.bind(this);
    this.openPortForwardModal = this.openPortForwardModal.bind(this);
    this.openCommandsModal = this.openCommandsModal.bind(this);
  }

  render(){
    return(
      <S.Card>
        { this.renderHeader() }
        { this.renderContentRows() }
        { this.renderPodStatuses() }
        { this.renderAdditionalControls() }
      </S.Card>
    )
  }

  componentDidMount(){
    // if(this.props.deployment.name === 'news-crawl'){
    //   this.openCommandsModal();
    // }
  }

  renderHeader(){
    const { deployment, matching } = this.props;
    let frameworkImg = MiscUtils.msImage(deployment, matching);
    let git = this.hasGit() ? MiscUtils.gitSummary(matching) : null;
    const subtitle = git || "Not connected to Git";
    const Ref = (p) => <Link to={this.detailPath()}>{p.children}</Link>;

    return(
      <S.Header>
        <S.HeaderImage src={frameworkImg} alt='Language'/>
        <Ref><S.HeaderTitle>{deployment.name}</S.HeaderTitle></Ref>
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
    const sourceText = MiscUtils.sourceString(dep.commit);
    const portText = `Ok CPU, low RAM`;

    return <S.ContentRows>
      <tbody>
        { this.buildRow('Image', dep.imageName, this.openImageModal) }
        { this.buildRow('Source', sourceText, this.openSourceModal) }
        { this.renderDnsRow() }
        { this.buildRow('Status', portText, () => alert("Bang!")) }
      </tbody>
    </S.ContentRows>;
  }

  renderDnsRow(){
    const svc = this.props.deployment.services[0];
    if(svc){
      const dnsMaterial = svc.externalIp ? 'language' : null;
      const dnsAction = () => this.openHttpModal(svc.shortDns);
      return this.buildRow('Quick DNS', svc.shortDns, dnsAction, dnsMaterial)
    } else {
      return this.buildRow('Quick DNS', "No Services", null)
    }
  }

  renderPodStatuses() {
    const pods = this.props.deployment.pods;
    const views = pods.map(pod =>
      <S.PodCircle
        key={pod.name}
        emotion={pod.state}
        title={pod.name}
      />
    );
    return <S.PodStatusesBox>{views}</S.PodStatusesBox>
  }

  renderAdditionalControls(){
    return(
      <S.AdditionalControlsBox>
        <ControlIcon
          icon='attach_money'
          title="CMD..."
          action={this.openCommandsModal}
        />
        <ControlIcon
          icon='arrow_upward'
          title="Port Forward..."
          action={this.openPortForwardModal}
        />
        <ControlIcon
          icon='import_export'
          title="Bind Local..."
        />
      </S.AdditionalControlsBox>
    )
  }

  openHttpModal(text){
    const svc = this.props.deployment.services[0];
    const bundle = {
      deployment: this.props.deployment,
      matching: this.props.matching,
      targetHost: text,
      port: svc.fromPort,
      mode: 'modal'
    };

    this.props.openModal(HttpActionsModal, bundle);
  }

  openImageModal(){
    const bundle = {
      deployment: this.props.deployment,
      matching: this.props.matching,
      refreshCallback: this.props.refreshCallback,
      mode: 'modal'
    };
    this.props.openModal(ImageOpsModal, bundle);
  }

  openSourceModal(){
    const { deployment, matching, replaceModal } = this.props;
    let bundle = {deployment, matching, replaceModal, mode: 'modal'};
    this.props.openModal(DepSourceModal, bundle);
  }

  openPortForwardModal(){
    const { deployment, matching } = this.props;
    let bundle = {deployment, matching, mode: 'modal'};
    this.props.openModal(PortForwardModal, bundle);
  }

  openCommandsModal(){
    const { deployment, matching } = this.props;
    let bundle = {deployment, matching, mode: 'modal'};
    this.props.openModal(CommandsModal, bundle);
  }

  buildRow(label, text, callback, material){
    return(
      <CardRow
        label={label}
        text={text}
        getDeployment={() => this.props.deployment}
        callback={callback}
        material={material}
      />
    )
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

function ControlIcon(props){
  return(
    <S.ControlIcon
      className='material-icons'
      title={props.title}
      onClick={props.action}>
      { props.icon }
    </S.ControlIcon>
  )
}