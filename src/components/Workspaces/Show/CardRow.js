import s from "./CardRow.sass";
import React from "react";
import PropTypes from 'prop-types'

export default class CardRow extends React.Component {
  render(){
    const { label, text } = this.props;

    return(
      <tr>
        <td>
          <p className={s.rowText}>{label}</p>
        </td>
        <td>
          <p className={s.rowTextClickable}
             onClick={this.props.openModal}>
            { text }
          </p>
        </td>
      </tr>
    )
  }

  static propTypes = {
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    getDeployment: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired
  };

}