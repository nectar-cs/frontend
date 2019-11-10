import React from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import defaults from './defaults'
import ComingSoonSection from "../../widgets/ComingSoonSection/ComingSoonSection";

export default class HotReloadModal extends React.Component{

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
        { this.renderComingSoon() }
      </FlexibleModal>
    )
  }

  componentDidMount(){
    MiscUtils.mp("Live Sync Start", {});
  }

  renderHeader(){
    const { deployment } = this.props;
    return(
      <LeftHeader
        graphicName={MiscUtils.modalImage(this, 'import_export')}
        graphicType={MiscUtils.modalGraphicType(this)}
        title={defaults.header.title(deployment.name)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderComingSoon(){
    return(
      <ComingSoonSection
      />
    )
  }
}