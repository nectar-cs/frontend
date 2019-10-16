import React from 'react'
import Section from "./Section";
import MatchPreview from "../Matching/MatchPreview";
import HttpActionsModal from "../../../modals/HttpActionsModal/HttpActionsModal";
import ImageOpsModal from "../../../modals/ImageActionsModal/ImageOpsModal";

export default class HttpOpsSection extends Section {

  renderDefaultModal(source){
    const { deployment, matching } = source || this.props;
    return(
      <HttpActionsModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    )
  }
}