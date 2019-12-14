import React from 'react';
import MatchModal from '../../../modals/MatchModal/MatchModal';
import Section from './Section';

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
