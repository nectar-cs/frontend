import React from 'react';
import FlexibleModal from '../../hocs/FlexibleModal';
import Utils from '../../utils/Utils';
import defaults from './defaults';
import ComingSoonSection from '../../widgets/ComingSoonSection/ComingSoonSection';
import { LeftHeader } from "@nectar/js-common";

export default class HotReloadModal extends React.Component {
  render() {
    return (
      <FlexibleModal mode={this.props.mode}>
        {this.renderHeader()}
        {this.renderComingSoon()}
      </FlexibleModal>
    );
  }

  componentDidMount() {
    Utils.mp('Live Sync Start', {});
  }

  renderHeader() {
    const { deployment } = this.props;
    return (
      <LeftHeader
        graphicName={Utils.modalImage(this, 'import_export')}
        graphicType={Utils.modalGraphicType(this)}
        title={defaults.header.title(deployment.name)}
        subtitle={defaults.header.subtitle}
      />
    );
  }

  renderComingSoon() {
    return <ComingSoonSection />;
  }
}
