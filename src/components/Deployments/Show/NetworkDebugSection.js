import React from 'react'
import Section from "./Section";
import NetworkDebugModal from "../../../modals/NetworkDebugModal/NetworkDebugModal";

export default class NetworkDebugSection extends Section {
  defaultDetail(){
    const { deployment } = this.props;
    return(
      <NetworkDebugModal
        mode='fragment'
        deployment={deployment}
      />
    )
  }
}