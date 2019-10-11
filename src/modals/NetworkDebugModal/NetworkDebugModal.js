import React, {Fragment} from 'react'
import Modal from "../../hocs/Modal";
import defaults from "./defaults";
import DockerPortStep from "./DockerPortStep";

export default class NetworkDebugModal extends Modal {

  constructor(props) {
    super(props);
    this.state = {
      step: 0
    }
  }


  renderContent(){
    return(
      <Fragment>
        { this.renderDockerPhase() }
      </Fragment>
    )
  }

  renderDockerPhase(){
    return(
      <DockerPortStep

      />
    )
  }

  key(){
    const key = this.constructor.name.replace("Section", "");
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  defaults() { return defaults; }
}