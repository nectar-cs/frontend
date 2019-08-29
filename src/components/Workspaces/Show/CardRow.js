import s from "./CardRow.sass";
import React from "react";
import PropTypes from 'prop-types'

export default class CardRow extends React.Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    modalClass: PropTypes.object.isRequired,
    getDeployment: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired
  };

  render(){
    const { label, text } = this.props;

    return(
      <tr>
        <td>
          <p className={s.rowText}>{label}</p>
        </td>
        <td>
          <p className={s.rowTextClickable}
             onClick={() => this.modalAction()}>
            { text }
          </p>
        </td>
      </tr>
    )
  }

  modalAction(){
    const bundle = {
      deployment: this.props.getDeployment(),
      targetAddr: this.props.text
    };

    this.props.openModal(this.props.modalClass, bundle);
  }

}