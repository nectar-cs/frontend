import React from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import type {Deployment} from "../../types/Types";
import ResourceLogs from "../../widgets/ResourceLogs/ResourceLogs";
import MiscUtils from "../../utils/MiscUtils";
import LogsForm from "./LogsForm";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import defaults from "./defaults";


export default class DeploymentLogsModal extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      selectedPodName: defaultPodName(props)
    };
    this.update = this.update.bind(this);
  }

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
        { this.renderLogsForm() }
        { this.renderLogs() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    const { deployment, mode } = this.props;
    return(
      <LeftHeader
        graphicName={MiscUtils.modalImage(this, 'book')}
        title={defaults.header.title(deployment.name, mode)}
        subtitle={defaults.header.subtitle}
        graphicType={MiscUtils.modalGraphicType(this)}
      />
    )
  }

  renderLogsForm(){
    const { pods } = this.props.deployment;
    return(
      <LogsForm
        selectedPodName={this.state.selectedPodName}
        podNameChoices={pods.map(p => p.name)}
        notifyFormValueChanged={this.update}
      />
    )
  }

  renderLogs(){
    return(
      <ResourceLogs
        resourceType='pods'
        resourceName={this.state.selectedPodName}
      />
    )
  }

  update(key, value){
    this.set(s => ({...s, [key]: value }))
  }
}

function defaultPodName(props){
  return MiscUtils.tor(() =>  props.deployment.pods[0].name);
}

type Props = {
  mode: 'fragment' | 'modal',
  deployment: Deployment
}