import React from 'react'
import Section from "./Section";
import LeftHeader from "../../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../../utils/MiscUtils";
import S from "./SectionStyles";
import SS from './OverviewSectionStyles'
import OverviewModal from "../../../modals/OverviewModal/OverviewModal";
import Layout from "../../../assets/layouts";
import Text from "../../../assets/text-combos";

export default class OverviewSection extends Section {

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
        <p>Exposed </p>
        <Text.P raw pushed><b>{locality}</b></Text.P>
        <Text.P raw pushed>via</Text.P>
        <Text.P raw pushed><b>{service.type}</b></Text.P>
        <Text.P raw pushed>on ports</Text.P>
        <Text.P raw pushed>{portsStr}</Text.P>
        <Text.P raw pushed>at</Text.P>
        <Text.P raw pushed><u>{service.shortDns}</u></Text.P>
      </Layout.TextLine>
    )
  }

  renderDockerLine(){
    const { deployment } = this.props;
    const timestamp = MiscUtils.latestPodTs(deployment.pods);
    return(
      <Layout.TextLine low={1.4}>
        <p>Running</p>
        <Text.P raw pushed><b>{deployment.imageName}</b></Text.P>
        <Text.P raw pushed>since</Text.P>
        <Text.P raw pushed>{timestamp || '?'}</Text.P>
      </Layout.TextLine>
    )
  }

  renderAnnotatedLine(){
    const { commit } = this.props;
    if(!commit) return null;

    return(
      <Layout.TextLine low={1.4}>
        <p>Last deployed </p>
        <Text.P raw pushed><b>Yesterday at 8pm</b></Text.P>
        <Text.P raw pushed>by</Text.P>
        <Text.P raw pushed><u>xavier@codenectar.com</u></Text.P>
        <Text.P raw pushed>on branch</Text.P>
        <Text.P raw pushed><b>master</b></Text.P>
        <Text.P raw pushed>-</Text.P>
        <Text.P raw pushed>"it was the best".</Text.P>
      </Layout.TextLine>
    )
  }

  renderNotAnnotatedLine(){
    const { matching } = this.props;

    return(
      <Layout.TextLine low={1.4}>
        <p>Last deployed </p>
        <Text.P raw pushed>"it was the best".</Text.P>
      </Layout.TextLine>
    )
  }

  renderNotMatchedLine(){
    const { matching } = this.props;

    return(
      <Layout.TextLine low={1.4}>
        <p>Deployment not matched to a Git repo.</p>
        <Text.P raw pushed>Do it here.</Text.P>
      </Layout.TextLine>
    )
  }

  renderNotConnectedLine(){
    return(
      <Layout.TextLine low={1.4}>
        <p>No Git remotes setup</p>
        <Text.P raw pushed>Do it here.</Text.P>
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

}