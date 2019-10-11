import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import Layout from "../assets/layouts";

export default class FlexibleModal extends React.Component {

  render(){
    if(this.props.mode === 'modal'){
      return(
        <Layout.ModalLayout>{ this.props.children }</Layout.ModalLayout>
      )
    } else {
      return(
        <Fragment>{ this.props.children }</Fragment>
      )
    }
  }

  static propTypes = {
    mode: PropTypes.oneOf(['modal', 'fragment'])
  };

  static defaultProps = {
    mode: 'modal'
  }

}