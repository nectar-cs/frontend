import React from 'react';
import { connect } from 'react-redux';

function s2p(state) {
  const { openModal, replaceModal } = state.mainReducer;
  return { openModal, replaceModal };
}

export default class ModalClientComposer {
  static compose(component) {
    return connect(s2p)(component);
  }
}
