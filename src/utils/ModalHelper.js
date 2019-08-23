import React from "react";
import Modal from "react-modal";

export default class ModalHelper {
  static customStyles() {
    return {
      content : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        borderRadius: "4px",
        borderWidth: "0px",
        padding: '0'
      }
    }
  }

  static customStylesNoTransform() {
    return {
      content : {
        top: '20%',
        left: '70%',
        right: 'auto',
        bottom: 'auto',
        borderRadius: "4px",
        borderWidth: "0px"
      }
    }
  }
}