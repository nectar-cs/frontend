import React from 'react'
import Section from "./Section";
import ImageActionsModal from "../../../modals/ImageActionsModal/ImageActionsModal";

export default class ImageOpsSection extends Section {

  defaultDetail(){
    const { deployment, matching } = this.props;
    return(
      <ImageActionsModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    );
  }

}