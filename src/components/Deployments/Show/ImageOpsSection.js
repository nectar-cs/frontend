import React from 'react'
import Section from "./Section";
import ImageOpsModal from "../../../modals/ImageActionsModal/ImageOpsModal";

export default class ImageOpsSection extends Section {

  renderDefaultModal(source){
    const { deployment, matching } = source || this.props;
    return(
      <ImageOpsModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    );
  }

}