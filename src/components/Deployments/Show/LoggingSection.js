import React from 'react'
import Section from "./Section";
import CommandsModal from "../../../modals/CommandsModal/CommandsModal";
import DeploymentLogsModal from "../../../modals/DeploymentLogsModal/DeploymentLogsModal";

export default class LoggingSection extends Section {

  _renderActivityModal(source){
    const { deployment, matching } = source || this.props;
    return(
      <DeploymentLogsModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    );
  }

  _className() { return "LoggingSection"; }
}