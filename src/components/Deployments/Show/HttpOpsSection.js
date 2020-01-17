import React from 'react';
import Section from './Section';
import HttpActionsModal from '../../../modals/HttpActionsModal/HttpActionsModal';

export default class HttpOpsSection extends Section {
  _renderActivityModal(source) {
    const { deployment, matching } = source || this.props;
    return(
      <HttpActionsModal
        mode="fragment"
        deployment={deployment}
        matching={matching} />
    );
  }

  _className() {
    return HttpOpsSection._className();
  }

  static _className() {
    return 'HttpOpsSection';
  }
}
