import React from 'react'
import Utils from "../../utils/Utils";
import defaults from "./defaults";
import {Types} from "../../types/CommonTypes";
import CommandForm from "./CommandForm";
import CommandHistory from "./CommandHistory";
import Helper from "./Helper";
import Preview from "./Preview";
import FlexibleModal from "../../hocs/FlexibleModal";
import { CenterAnnouncement, LeftHeader, Loader, ModalButton } from "nectar-cs-js-common";

export default class CommandsModal extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      choices: {
        podName: Helper.defaultPod(this, props),
        command: ''
      },
      output: null,
      isExecuting: false,
    };

    this.formCallback = this.formCallback.bind(this);
    this.useHistoryItem = this.useHistoryItem.bind(this);
    this.downstreamReloader = null;
    this.eraseOutput = false;
  }

  componentDidMount(){
    Utils.mp("Command Operations Start", {});
  }

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
        { this.renderNoHealthyPods() }
        { this.renderTopLoader() }
        { this.renderForm() }
        { this.renderPreview() }
        { this.renderHistory() }
        { this.renderButton() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    const { deployment, mode } = this.props;
    return(
      <LeftHeader
        graphicName={Utils.modalImage(this, "attach_money")}
        graphicType={Utils.modalGraphicType(this)}
        title={defaults.header.title(deployment.name, mode)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderTopLoader(){
    if(!this.state.isExecuting) return null;
    return(
      <Loader.TopRightSpinner isFetching={true} />
    )
  }

  renderPreview(){
    if(!Helper.hasPods(this)) return null;
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
        applyCallback={this.useHistoryItem}
      />
    )
  }

  renderNoHealthyPods(){
    if(Helper.hasPods(this)) return null;
    return(
      <CenterAnnouncement
        iconName='sentiment_dissatisfied'
        text='Zero running pods to receive commands.'
      />
    )
  }

  renderButton(){
    const { executing, choices} = this.state;
    const ready = !!choices.command;
    return(
      <ModalButton
        title='Execute'
        callback={() => this.submit()}
        isEnabled={ready && !executing}
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

  useHistoryItem({command}){
    this.formCallback("command", command);
  }

  submit(){
    Utils.mp("Command Operations Send", {});
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
    ...FlexibleModal.propTypes
  };
}
