import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import Layout from '../assets/layouts';

export default function FlexibleModal({ mode, children }) {
  if (mode === 'modal') {
    return <Layout.ModalLayout>{children}</Layout.ModalLayout>;
  }
  return <Fragment>{children}</Fragment>;
}

FlexibleModal.propTypes = {
  mode: PropTypes.oneOf(['modal', 'fragment']),
};

FlexibleModal.defaultProps = {
  mode: 'modal',
};
