import React from 'react'
import Section from "./Section";
import MatchModal from "../../../modals/MatchModal/MatchModal";

export default class MatchingSection extends Section {

  _renderActivityModal(source){
    const { deployment } = source || this.props;
    return(
      <MatchModal
        mode='detail'
        deployment={deployment}
        onDeploymentReviewed={null}
        setIsFetching={null}
        hasGitRemote={true}
        hasImageRegistry={true}
        refreshCallback={this.props.refreshCallback}
      />
    )
  }

  _className() { return "MatchingSection"; }
}