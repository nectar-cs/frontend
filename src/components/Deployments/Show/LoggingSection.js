import React from 'react';
import DeploymentLogsModal from '../../../modals/DeploymentLogsModal/DeploymentLogsModal';
import Section from './Section';

export default class LoggingSection extends Section {
  _renderActivityModal(source) {
    const { deployment, matching } = source || this.props;
    return <DeploymentLogsModal mode="fragment" deployment={deployment} matching={matching} />;
  }

  _className() {
    return LoggingSection._className();
  }

  static _className() {
    return 'LoggingSection';
  }
}
