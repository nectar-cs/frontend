import React from 'react'
import Section from "./Section";
import CommandsModal from "../../../modals/CommandsModal/CommandsModal";

export default class CommandsSection extends Section {
  _renderActivityModal(source){
    const { deployment, matching } = source || this.props;
    return(
      <CommandsModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    );
  }

  _className() { return "CommandsSection"; }
}