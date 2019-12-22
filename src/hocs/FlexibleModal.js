import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Layout} from "@nectar/js-common";

export default function FlexibleModal({mode, children}){
  if(mode === 'modal'){
    return(
      <Layout.ModalLayout>{ children }</Layout.ModalLayout>
    )
  } else {
    return(
      <Fragment>{ children }</Fragment>
    )
  }
}

FlexibleModal.propTypes = {
  mode: PropTypes.oneOf(['modal', 'fragment'])
};

FlexibleModal.defaultProps = {
  mode: 'modal'
};
