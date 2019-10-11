import React from 'react'
import Section from "./Section";
import CommandsModal from "../../../modals/CommandsModal/CommandsModal";
import PortForwardModal from "../../../modals/PortForwardModal/PortForwardModal";

export default class PortForwardSection extends Section {
  defaultDetail(){
    const { deployment, matching } = this.props;
    return(
      <PortForwardModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    );
  }
}