import React from 'react';
import HotReloadModal from '../../../modals/HotReloadingModal/HotReloadModal';
import Section from './Section';

export default class HotReloadSection extends Section {
  _renderActivityModal(source) {
    const { deployment, matching } = source || this.props;
    return <HotReloadModal mode="fragment" deployment={deployment} matching={matching} />;
  }

  _className() {
    return HotReloadSection._className();
  }

  static _className() {
    return 'HotReloadSection';
  }
}
