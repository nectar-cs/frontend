import React from 'react'
import {Container, Intro} from "./ImageActionsModalStyles";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import {FULL_DEPLOYMENT} from "../../types/Deployment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import ImageForm from "./ImageForm";
import {ThemeProvider} from "styled-components";
import {theme} from "../../assets/constants";
import Kapi from "../../utils/Kapi";
import ImageReplaceTable from "./ImageReplaceTable";

const PHASE_CONFIG = 'configuring';

export default class ImageActionsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      config: {
        operationType: 'reload',
        imageName: props.deployment.imageName
      },
      phase: PHASE_CONFIG,
      autoUpdate: false
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Container>
          { this.renderHeader() }
          { this.renderIntro() }
          { this.renderOptionsForm() }
          { this.renderPodList() }
          { this.renderButton() }
        </Container>
      </ThemeProvider>
    )
  }

  renderIntro(){
    return(
      <Intro>You can set a new image or force
        apply one with the same name.</Intro>
    )
  }

  renderOptionsForm(){
    if(this.state.phase === PHASE_CONFIG)
      return this.renderConfigPhase();
    else return null;
  }

  renderConfigPhase(){
    return(
      <ImageForm
        operationType={this.state.config.operationType}
        imageName={this.state.config.imageName}
        onAssignment={(a) => this.onAssignment(a)}
      />
    )
  }

  renderHeader(){
    return(
      <LeftHeader
        graphicName={MiscUtils.frameworkImage('docker')}
        title={`${this.props.deployment.name} / image ops`}
        subtitle={'Not connected to Git'}
      />
    )
  }

  renderPodList(){
    return(
      <ImageReplaceTable
        depNamespace={this.props.deployment.namespace}
        depName={this.props.deployment.name}
        autoUpdate={this.state.autoUpdate}
      />
    )
  }

  renderButton(){
    return(
      <ModalButton
        callback={() => this.submit()}
        title='Apply'
      />
    )
  }

  onFailure(){
    console.log("Failure");
  }

  onSuccess(){
    console.log("Success");
  }

  submit() {
    const payload = {
      dep_namespace: this.props.deployment.namespace,
      dep_name: this.props.deployment.name
    };

    const endpoint = '/api/run/image_reload';
    this.setState(s => ({...s, autoUpdate: !s.autoUpdate}));
    Kapi.post(endpoint, payload, this.onSuccess, this.onFailure);
  }

  onAssignment(assignment){
    const merged = {...this.state.config, ...assignment};
    this.setState(s => ({...s, config: merged}));
  }

  static propTypes = {
    ...FULL_DEPLOYMENT
  }
}