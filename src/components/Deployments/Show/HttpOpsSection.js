import React from 'react'
import Section from "./Section";
import MatchPreview from "../Matching/MatchPreview";
import HttpActionsModal from "../../../modals/HttpActionsModal/HttpActionsModal";
import ImageActionsModal from "../../../modals/ImageActionsModal/ImageActionsModal";

export default class HttpOpsSection extends Section {

  defaultDetail(){
    const { deployment, matching} = this.props;
    return(
      <HttpActionsModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    )
  }
}