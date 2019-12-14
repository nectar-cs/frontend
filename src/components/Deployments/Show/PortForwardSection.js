import React from 'react';
import PortForwardModal from '../../../modals/PortForwardModal/PortForwardModal';
import Section from './Section';

export default class PortForwardSection extends Section {
  _renderActivityModal(source) {
    const { deployment, matching } = source || this.props;
    return <PortForwardModal mode="fragment" deployment={deployment} matching={matching} />;
  }

  _className() {
    return PortForwardSection._className();
  }

  static _className() {
    return 'PortForwardSection';
  }
}
