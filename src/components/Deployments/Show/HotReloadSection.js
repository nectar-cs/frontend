import React from 'react'
import Section from "./Section";
import HttpActionsModal from "../../../modals/HttpActionsModal/HttpActionsModal";
import HotReloadModal from "../../../modals/HotReloadingModal/HotReloadModal";

export default class HotReloadSection extends Section {

  _renderActivityModal(source){
    const { deployment, matching } = source || this.props;
    return(
      <HotReloadModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    )
  }
}