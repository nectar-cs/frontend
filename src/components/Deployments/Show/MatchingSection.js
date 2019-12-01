import React from 'react';
import Section from './Section';
import MatchModal from '../../../modals/MatchModal/MatchModal';

export default class MatchingSection extends Section {
  _renderActivityModal(source) {
    const { deployment, matching } = source || this.props;
    return (
      <MatchModal
        mode="detail"
        deployment={deployment}
        matching={matching}
        onDeploymentReviewed={null}
        setIsFetching={null}
        hasGitRemote={true}
        hasImageRegistry={true}
        callback={this.props.refreshCallback}
      />
    );
  }

  _className() {
    return MatchingSection._className();
  }
  static _className() {
    return 'MatchingSection';
  }
}
