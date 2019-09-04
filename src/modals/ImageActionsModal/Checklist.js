import React from 'react'
import PropTypes from 'prop-types'
import ChecklistItem from "./ChecklistItem";

export default class Checklist extends React.Component {

  render(){
    return(
      <p>jokes</p>
    )
  }

  renderItems(){
    return this.props.items.map(item => (
      <tr>
        <ChecklistItem
          {...item}
        />
      </tr>
    ));
  }

  static propTypes = {
    items: PropTypes.arrayOf(ChecklistItem.propTypes)
  }
}
