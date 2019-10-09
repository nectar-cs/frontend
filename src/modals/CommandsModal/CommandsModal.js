import React, {Fragment} from 'react'
import Layout from './../../assets/layouts'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import defaults from "./defaults";
import {Types} from "../../types/Deployment";
import CommandForm from "./CommandForm";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import ModalButton from "../../widgets/Buttons/ModalButton";
import TopLoader from "../../widgets/TopLoader/TopLoader";
import CommandHistory from "./CommandHistory";
import Helper from "./Helper";
import Preview from "./Preview";

export default class CommandsModal extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      choices: {
        podName: Helper.defaultPod(this, props),
        command: 'rake db:migrate'
      },
      output: null,
      isExecuting: false,
    };
    this.formCallback = this.formCallback.bind(this);
    this.downstreamReloader = null;
    this.eraseOutput = false;
  }

  render(){
    return(
      <Layout.ModalLayout>
        { this.renderHeader() }
        { this.renderNoHealthyPods() }
        { this.renderTopLoader() }
        { this.renderForm() }
        { this.renderPreview() }
        { this.renderHistory() }
        { this.renderButton() }
      </Layout.ModalLayout>
    )
  }

  renderHeader(){
    const { deployment, matching } = this.props;
    return(
      <LeftHeader
        graphicName={MiscUtils.msImage(deployment, matching)}
        title={defaults.header.title(deployment.name)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderTopLoader(){
    if(!this.state.isExecuting) return null;
    return(
      <TopLoader isFetching={true} />
    )
  }

  renderPreview(){
    return(
      <Preview
        command={Helper.previewCommand(this)}
        output={!this.eraseOutput && this.state.output}
        isExecuting={this.state.isExecuting}
      />
    )
  }

  renderForm(){
    if(!Helper.hasPods(this)) return null;
    const { choices } = this.state;
    const { deployment } = this.props;
    return(
      <CommandForm
        podName={choices.podName}
        command={choices.command}
        podNameOptions={deployment.pods.map(p => p.name)}
        notifyFormValueChanged={this.formCallback}
      />
    )
  }

  renderHistory(){
    if(!Helper.hasPods(this)) return null;
    const reloadTriggerSetter = (v) => { this.downstreamReloader = v };

    return(
      <CommandHistory
        deployment={this.props.deployment}
        setReloadTrigger={reloadTriggerSetter}
      />
    )
  }

  renderNoHealthyPods(){
    if(Helper.hasPods(this)) return null;
    return(
      <CenterAnnouncement
        iconName='sentiment_dissatisfied'
      />
    )
  }

  renderButton(){
    return(
      <ModalButton
        title='Execute'
        callback={() => this.submit()}
        isEnabled={!this.state.isExecuting}
      />
    )
  }

  formCallback(key, value){
    this.eraseOutput = true;
    this.setState(s => {
      const choices = { ...s.choices, [key]: value };
      return {...s, choices, eraseOutput: true};
    });
  }

  submit(){
    this.setState(s => ({...s, isExecuting: true}));
    Helper.submitCommand(this, (resp) => {
      this.eraseOutput = false;
      const output = resp['data'];
      const state = { eraseOutput: true, isExecuting: false, output };
      this.setState(s => ({...s, ...state}));
      Helper.recordCommand(this, () => this.downstreamReloader());
    });
  }

  static propTypes = {
    deployment: Types.Deployment.isRequired,
    matching: Types.Matching,
  }
}
