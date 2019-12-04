import React from 'react';
import Section from './Section';
import HotReloadModal from '../../../modals/HotReloadingModal/HotReloadModal';

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
