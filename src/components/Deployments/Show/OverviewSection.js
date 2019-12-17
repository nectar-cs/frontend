//@flow

import React, {Fragment} from 'react'
import Section from "./Section";
import LeftHeader from "../../../widgets/LeftHeader/LeftHeader";
import Utils from "../../../utils/Utils";
import SS from './OverviewSectionStyles'
import OverviewModal from "../../../modals/OverviewModal/OverviewModal";
import {Layout} from "ui-common/api/styles";
import {Text} from "ui-common/api/styles";
import {connect} from "react-redux";
import {Types} from "../../../types/CommonTypes";
import ImageOpsSection from "./ImageOpsSection";
import PodsAtGlance from "../../../widgets/PodsView/PodsAtGlance";
import HttpOpsSection from "./HttpOpsSection";
import moment from "moment";
import IntegrationsModal from "../../../modals/IntegrationsModal/IntegrationsModal";
import MatchingSection from "./MatchingSection";
import LastCommitModal from "../../../modals/LastCommitModal/LastCommitModal";
import PodModal from "../../../modals/PodModal/PodModal";
import PropTypes from 'prop-types'

function T(props){
  return <Text.P raw pushed {...props}>{props.children}</Text.P>
}

function TA(props){
  return <Text.PA raw pushed {...props}>{props.children}</Text.PA>
}

class OverviewSectionClass extends Section {

  constructor(props) {
    super(props);
    this.goToDocker = this.goToDocker.bind(this);
    this.goToHttp = this.goToHttp.bind(this);
    this.goToMatching = this.goToMatching.bind(this);
    this.openCommitModal = this.openCommitModal.bind(this);
    this.openIntegrationsModal = this.openIntegrationsModal.bind(this);
    this.invokePodViewOverride = this.invokePodViewOverride.bind(this);
  }

  render(){
    return(
      <SS.Section onClick={this.onClicked}>
        { this.renderHeader() }
        { this.renderLines() }
        { this.renderPods() }
      </SS.Section>
    )
  }

  renderLines(){
    const { deployment } = this.props;
    if(!deployment) return null;

    return(
      <SS.ContentRow>
        { this.renderDockerLine() }
        { this.renderAnnotatedLine() }
        { this.renderNotAnnotatedLine() }
        { this.renderServiceLines() }
        { this.renderNotMatchedLine() }
        { this.renderNotConnectedLine() }
      </SS.ContentRow>
    )
  }

  renderHeader(){
    const { deployment, matching } = this.props;
    if(!deployment) return null;

    return(
      <LeftHeader
        graphicName={Utils.msImage(deployment, matching)}
        title={`${deployment.namespace} / ${deployment.name}`}
        subtitle={Utils.gitSummary(matching, true)}
      />
    )
  }

  renderServiceLines(){
    return this.props.deployment.services.map(service => (
      this.renderServiceLine(service)
    ));
  }

  renderServiceLine(service){
    const locality = service.externalIp ? "publicly"  : "locally";
    const portsStr = Utils.portMappingsStr(service.ports);
    return(
      <Layout.TextLine low={1.4} key={service.name}>
        <p>Exposed</p>
        <T><b>{locality}</b></T>
        <T>via</T>
        <T><b>{service.type}</b></T>
        <T>on ports</T>
        <T>{portsStr}</T>
        <T>at</T>
        <TA onClick={this.goToHttp} ><u>{service.shortDns}</u></TA>
      </Layout.TextLine>
    )
  }

  renderDockerLine(){
    const { deployment } = this.props;
    const timestamp = Utils.latestPodTs(deployment.pods);
    return(
      <Layout.TextLine low={1.4}>
        <p>Running</p>
        <TA onClick={this.goToDocker}><b>{deployment.imageName}</b></TA>
        <T>since</T>
        <T>{timestamp || '?'}</T>
      </Layout.TextLine>
    )
  }

  renderAnnotatedLine(){
    const { commit } = this.props.deployment;
    if(!commit) return null;
    const { message, branch, timestamp, author } = commit;

    const TimePart = () => timestamp ? (
      <T><b>{moment(timestamp).calendar()}</b></T>
    ) : null;

    const AuthorPart = () => author ? (
      <Fragment>
        <T>by</T>
        <T><u>{author || '?'}</u></T>
      </Fragment>
    ) : null;

    return(
      <Layout.TextLine low={1.4}>
        <p>Deployed from git </p>
        <TimePart/>
        <AuthorPart/>
        <T>from branch</T>
        <T><b>{branch}</b></T>
        <T>-</T>
        <Text.PA onClick={this.openCommitModal}>"{message}".</Text.PA>
      </Layout.TextLine>
    )
  }

  renderNotAnnotatedLine(){
    if(this.props.deployment.commit) return null;

    return(
      <Layout.TextLine low={1.4}>
        <p>Annotations about the latest commit not found.</p>
        <TA onClick={this.openCommitModal}><u>Learn more.</u></TA>
      </Layout.TextLine>
    )
  }

  renderNotMatchedLine(){
    if(this.props.matching) return null;
    return(
      <Layout.TextLine low={1.4}>
        <p>Deployment not matched to a Git repo.</p>
        <TA onClick={this.goToMatching}>Do it here.</TA>
      </Layout.TextLine>
    )
  }

  renderNotConnectedLine(){
    const { remotes } = this.props;
    if(remotes.git.length > 0) return null;

    return(
      <Layout.TextLine low={1.4}>
        <p>No Git remotes setup</p>
        <TA onClick={this.openIntegrationsModal}><b>Do it here.</b></TA>
      </Layout.TextLine>
    )
  }

  renderPods(){
    const { deployment, matching } = this.props;
    return(
      <PodsAtGlance
        deployment={deployment}
        matching={matching}
        action={this.invokePodViewOverride}
      />
    )
  }

  _renderActivityModal(key, source) {
    source = source || this.props;
    return(
      <OverviewModal
        deployment={source.deployment}
        matching={source.matching}
        mode='fragment'
      />
    )
  }

  openCommitModal(){
    const { deployment, matching } = this.props;
    this.props.openModal(
      LastCommitModal,
      { deployment, matching }
    )
  }

  renderDetailPodView(pod){
    const { deployment, matching } = this.props;
    return(
      <PodModal
        deployment={deployment}
        matching={matching}
        mode='fragment'
        pod={pod}
      />
    )
  }

  invokePodViewOverride(pod){
    const { overrideDetail } = this.props;
    overrideDetail(this.renderDetailPodView(pod));
  }

  openIntegrationsModal(){
    this.props.openModal(IntegrationsModal);
  }

  goToDocker(){ this.props.onClicked(ImageOpsSection.name); }
  goToHttp(){ this.props.onClicked(HttpOpsSection.name); }
  goToMatching(){ this.props.onClicked(MatchingSection.name); }

  static propTypes = {
    remotes: Types.GlobalRemotes.isRequired,
    deployment: Types.Deployment,
    matching: Types.Matching,
    overrideDetail: PropTypes.func
  };

  _className() { return OverviewSectionClass._className() }
  static _className(){ return "OverviewSection"; }
}

function s2P(state){
  return {
    remotes: state.mainReducer.remotes,
    openModal: state.mainReducer.openModal
  }
}

const Hack = connect(s2P)(OverviewSectionClass);

export default class OverviewSection extends React.Component{
  render(){ return <Hack {...this.props}/>; }
  static _className() { return "OverviewSection"; }
}