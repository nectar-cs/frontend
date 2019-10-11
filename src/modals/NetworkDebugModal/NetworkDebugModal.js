import React, {Fragment} from 'react'
import Modal from "../../hocs/Modal";
import defaults from "./defaults";

export default class NetworkDebugModal extends Modal {

  renderContent(){
    return(
      <Fragment>
        <p>Debug</p>
      </Fragment>
    )
  }

  defaults() { return defaults; }
}