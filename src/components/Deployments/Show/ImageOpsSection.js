import React from 'react';
import ImageOpsModal from '../../../modals/ImageOpsModal/View/ImageOpsModal';
import Section from './Section';

export default class ImageOpsSection extends Section {
  _renderActivityModal(source) {
    const { deployment, matching } = source || this.props;
    return (
      <ImageOpsModal
        mode="fragment"
        deployment={deployment}
        matching={matching}
        refreshCallback={this.props.refreshCallback}
      />
    );
  }

  static _className() {
    return 'ImageOpsSection';
  }

  _className() {
    return ImageOpsSection._className();
  }
}
