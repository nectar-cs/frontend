import React from 'react'
import Section from "./Section";
import ImageOpsModal from "../../../modals/ImageActionsModal/ImageOpsModal";
import CommandsModal from "../../../modals/CommandsModal/CommandsModal";

export default class CommandsSection extends Section {
  renderDefaultModal(source){
    const { deployment, matching } = source || this.props;
    return(
      <CommandsModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    );
  }
}