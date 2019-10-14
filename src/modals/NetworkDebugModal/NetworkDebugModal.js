import React, {Fragment} from 'react'
import Modal from "../../hocs/Modal";
import defaults from "./defaults";
import DockerPortStep from "./DockerPortStep";
import StaticChecksStep from "./StaticChecksStep";
import Helper from './Helper'
import PodsStep from "./PodsStep";
import ServiceStep from "./ServiceStep";
import InterferenceStep from "./InterferenceStep";

export default class NetworkDebugModal extends Modal {

  constructor(props) {
    super(props);
    this.state = {
      stepI: 0
    }
  }

  renderContent(){


    return(
      <Fragment>
        { this.renderSteps() }
      </Fragment>
    )
  }

  renderSteps(){
    const { stepI } = this.state;
    return NetworkDebugModal.stepClasses.map((Step, i) => (
      <Step
        key={i}
        isActive={i <= stepI}
      />
    ))
  }

  key(){
    const key = this.constructor.name;
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  defaults() { return defaults; }

  static stepClasses = [
    StaticChecksStep,
    DockerPortStep,
    PodsStep,
    ServiceStep,
    InterferenceStep
  ]

}