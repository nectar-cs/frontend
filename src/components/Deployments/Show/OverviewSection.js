import React from 'react'
import Section from "./Section";
import LeftHeader from "../../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../../utils/MiscUtils";
import S from "./SectionStyles";
import SS from './OverviewSectionStyles'
import OverviewModal from "../../../modals/OverviewModal/OverviewModal";
import Layout from "../../../assets/layouts";
import Text from "../../../assets/text-combos";
import {connect} from "react-redux";
import {Types} from "../../../types/Deployment";

function T(props){
  return <Text.P raw pushed>{props.children}</Text.P>
}

class OverviewSectionClass extends Section {

  render(){
    return(
      <S.Section onClick={this.onClicked}>
        { this.renderHeader() }
        { this.renderLines() }
        { this.renderPods() }
      </S.Section>
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
      </SS.ContentRow>
    )
  }

  renderServiceLines(){
    return this.props.deployment.services.map(service => (
      this.renderServiceLine(service)
    ));
  }

  renderServiceLine(service){
    const locality = service.externalIp ? "publicly"  : "locally";
    const portsStr = MiscUtils.portMappingsStr(service.ports);
    return(
      <Layout.TextLine low={1.4} key={service.name}>
        <p>Exposed</p>
        <T><b>{locality}</b></T>
        <T>via</T>
        <T><b>{service.type}</b></T>
        <T>on ports</T>
        <T>{portsStr}</T>
        <T>at</T>
        <T><u>{service.shortDns}</u></T>
      </Layout.TextLine>
    )
  }

  renderDockerLine(){
    const { deployment } = this.props;
    const timestamp = MiscUtils.latestPodTs(deployment.pods);
    return(
      <Layout.TextLine low={1.4}>
        <p>Running</p>
        <T><b>{deployment.imageName}</b></T>
        <T>since</T>
        <T>{timestamp || '?'}</T>
      </Layout.TextLine>
    )
  }

  renderAnnotatedLine(){
    const { remotes, commit } = this.props;
    if(!commit) return null;

    return(
      <Layout.TextLine low={1.4}>
        <p>Last deployed </p>
        <T><b>Yesterday at 8pm</b></T>
        <T>by</T>
        <T><u>xavier@codenectar.com</u></T>
        <T>on branch</T>
        <T><b>master</b></T>
        <T>-</T>
        <T>"it was the best".</T>
      </Layout.TextLine>
    )
  }

  renderNotAnnotatedLine(){
    const { matching } = this.props;

    return(
      <Layout.TextLine low={1.4}>
        <p>Annotations about the latest commit not found.</p>
        <T><u>Learn more.</u></T>
      </Layout.TextLine>
    )
  }

  renderNotMatchedLine(){
    const { matching } = this.props;
    if(!matching) return null;

    return(
      <Layout.TextLine low={1.4}>
        <p>Deployment not matched to a Git repo.</p>
        <T>Do it here.</T>
      </Layout.TextLine>
    )
  }

  renderNotConnectedLine(){
    const { remotes } = this.props;
    if(remotes.git.length > 0) return null;

    return(
      <Layout.TextLine low={1.4}>
        <p>No Git remotes setup</p>
        <T>Do it here.</T>
      </Layout.TextLine>
    )
  }

  renderPods(){
    return null;
  }

  _renderActivityModal(key, source) {
    return(
      <OverviewModal
        deployment={source.deployment}
        matching={source.matching}
        mode='fragment'
      />
    )
  }

  renderHeader(){
    const { deployment, matching } = this.props;
    if(!deployment) return null;

    return(
      <LeftHeader
        graphicName={MiscUtils.msImage(deployment, matching)}
        title={`${deployment.namespace} / ${deployment.name}`}
        subtitle={matching && MiscUtils.gitSummary(matching)}
      />
    )
  }

  static propTypes = {
    remotes: Types.GlobalRemotes.isRequired,
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}

function s2P(state){ return { remotes: state.mainReducer.remotes } }
const Hack = connect(s2P)(OverviewSectionClass);
export default class OverviewSection extends React.Component{
  render(){ return <Hack {...this.props}/> }
}