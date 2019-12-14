import React from 'react';
import CommandsModal from '../../../modals/CommandsModal/CommandsModal';
import Section from './Section';

export default class CommandsSection extends Section {
  _renderActivityModal(source) {
    const { deployment, matching } = source || this.props;
    return <CommandsModal mode="fragment" deployment={deployment} matching={matching} />;
  }

  _className() {
    return CommandsSection._className();
  }

  static _className() {
    return 'CommandsSection';
  }
}
