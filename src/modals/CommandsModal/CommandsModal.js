import React, {Fragment} from 'react'
import {Layout} from './../../assets/layouts'
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
    const { deployment } = props;
    const dPod = this.hasPods(props) ? deployment.pods[0].name : null;

    this.state = {
      choices: {
        podName: dPod,
        command: 'rake db:migrate'
      },
      output: null,
      isExecuting: false,
      eraseOutput: true
    };
    this.formCallback = this.formCallback.bind(this);
    this.downstreamReloader = null;
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
        output={this.state.output}
        isExecuting={this.state.isExecuting}
        eraseOutput={this.state.eraseOutput}
      />
    )
  }

  renderForm(){
    if(!this.hasPods()) return null;
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
    if(!this.hasPods()) return null;
    const reloadTriggerSetter = (v) => { this.downstreamReloader = v };

    return(
      <CommandHistory
        deployment={this.props.deployment}
        setReloadTrigger={reloadTriggerSetter}
      />
    )
  }

  renderNoHealthyPods(){
    if(this.hasPods()) return null;
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
    this.setState(s => {
      const choices = { ...s.choices, [key]: value };
      return {...s, choices, eraseOutput: true};
    });
  }

  submit(){
    this.setState(s => ({...s, isExecuting: true}));
    Helper.submitCommand(this, (resp) => {
      const output = resp['data'];
      const state = { eraseOutput: true, isExecuting: false, output };
      this.setState(s => ({...s, ...state}));
      Helper.recordCommand(this, () => this.downstreamReloader());
    });
  }

  hasPods(source){
    const { deployment } = (source || this.props);
    const runningPods = deployment.pods.filter(pod => (
      pod.state.toLowerCase() === 'running'
    ));
    return runningPods.length > 0;
  }

  static propTypes = {
    deployment: Types.Deployment.isRequired,
    matching: Types.Matching,
  }
}
