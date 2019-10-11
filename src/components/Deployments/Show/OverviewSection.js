import React from 'react'
import Section from "./Section";
import LeftHeader from "../../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../../utils/MiscUtils";
import S from "./SectionStyles";

export default class OverviewSection extends Section {

  render(){
    return(
      <S.Relaxed>
        { this.renderHeader() }
      </S.Relaxed>
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