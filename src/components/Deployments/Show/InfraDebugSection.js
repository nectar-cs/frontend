import React from 'react'
import Section from "./Section";
import NetworkDebugModal from "../../../modals/NetworkDebugModal/NetworkDebugModal";

export default class InfraDebugSection extends Section {
  renderDefaultModal(source){
    return this.renderNetworkDebugModal(source);
  }

  _renderActivityModal(key, source){
    if(key === 'networkingDebug')
      return this.renderNetworkDebugModal(source);
    else if(key === 'podDebug')
      return this.renderPodDebugModal(source);
    else return null;
  }

  renderNetworkDebugModal(source){
    const { deployment } = source || this.props;
    return(
      <NetworkDebugModal
        mode='fragment'
        deployment={deployment}
      />
    )
  }

  renderPodDebugModal(){
    return <p>Pod debug coming soon ;)</p>;
  }
}