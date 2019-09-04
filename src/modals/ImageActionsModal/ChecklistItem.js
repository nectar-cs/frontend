import React from 'react'
import PropTypes from 'prop-types'

export default class ChecklistItem extends React.Component{
  render(){

  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    detail: PropTypes.string,
    status: PropTypes.oneOf(['idle', 'working', 'done', 'failed'])
  }
}