import React from 'react'
import Section from "./Section";
import LeftHeader from "../../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../../utils/MiscUtils";

export default class OverviewSection extends Section {
  renderExpanded() {
    return this.renderHeader();
  }

  renderHeader(){
    const { deployment, matching } = this.state;
    if(!deployment) return null;

    return(
      <LeftHeader
        graphicName={MiscUtils.msImage(deployment, matching)}
        title={`${this.depNs()} / ${deployment.name}`}
        subtitle={matching && MiscUtils.gitSummary(matching)}
      />
    )
  }



}