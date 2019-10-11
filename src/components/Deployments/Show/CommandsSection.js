import React from 'react'
import Section from "./Section";
import ImageActionsModal from "../../../modals/ImageActionsModal/ImageActionsModal";
import CommandsModal from "../../../modals/CommandsModal/CommandsModal";

export default class CommandsSection extends Section {
  defaultDetail(){
    const { deployment, matching } = this.props;
    return(
      <CommandsModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    );
  }
}