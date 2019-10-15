import React, {Fragment} from 'react'
import Modal from "../../hocs/Modal";
import defaults from "./defaults";
import DockerPortStep from "./DockerPortStep";
import StaticChecksStep from "./StaticChecksStep";
import PodsStep from "./PodsStep";
import ServiceStep from "./ServiceStep";
import InterferenceStep from "./InterferenceStep";
import ExpectationsForm from "./ExpectationsForm";
import Helper2 from "./Helper2";

export default class NetworkDebugModal extends Modal {
  constructor(props) {
    super(props);
    const defaultService = Helper2.defaultService(this);
    this.state = {
      choices: {
        service: defaultService,
        origin: Helper2.defaultOrigin(),
        port: Helper2.defaultPort(this, defaultService)
      },
      stepI: 0
    };

    this.onFormChanged = this.onFormChanged.bind(this);
    this.beginNextStep = this.beginNextStep.bind(this);
  }

  renderContent(){
    return(
      <Fragment>
        { this.renderForm() }
        { this.renderSteps() }
      </Fragment>
    )
  }

  renderForm(){
    if(this.state.stepI >= 0) return null;

    return(
      <ExpectationsForm
        {...this.state.choices}
        notifyFormValueChanged={this.onFormChanged}
        beginCallback={this.beginNextStep}
        serviceChoices={Helper2.serviceChoices(this)}
        portChoices={Helper2.portChoices(this)}
      />
    )
  }



  renderSteps(){
    if(this.state.stepI < 0) return null;

    const { stepI } = this.state;
    return NetworkDebugModal.stepClasses.map((Step, i) => (
      <Step
        key={i}
        isActive={i === stepI}
        nextStepCallback={this.beginNextStep}
      />
    ))
  }

  onFormChanged(key, value){
    let assignment = { [key]: value };
    if(key === 'service'){
      const port = Helper2.defaultPort(this, value);
      const portChoices = Helper2.portChoices(this, value);
      assignment = {...assignment, port, portChoices};
    }
    this.setState(s => ({...s, choices: { ...s.choices, ...assignment }}));
  }

  beginNextStep(){
    this.setState(s => ({...s, stepI: s.stepI + 1}));
  }

  key(){
    const key = this.constructor.name;
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  defaults() { return defaults; }

  static stepClasses = [
    StaticChecksStep, DockerPortStep, PodsStep,
    ServiceStep, InterferenceStep
  ]
}