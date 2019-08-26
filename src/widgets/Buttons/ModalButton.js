import React from 'react'
import s from './ModalButton.sass'
import PropTypes from 'prop-types'

export default class ModalButton extends React.Component {
  render(){
    return(
      <button
        disabled={!this.props.isEnabled}
        className={s.button}
        onClick={this.props.callback}>
        {this.props.title}
      </button>
    )
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
    isEnabled: PropTypes.bool
  };

  static defaultProps = {
    isEnabled: true
  }
}