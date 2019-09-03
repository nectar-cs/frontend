import React from 'react'
import {Container, Intro} from "./ImageActionsModalStyles";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import {FULL_DEPLOYMENT} from "../../types/Deployment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import ImageForm from "./ImageForm";
import {ThemeProvider} from "styled-components";
import {theme} from "../../assets/constants";

const PHASE_CONFIG = 'configuring';

export default class ImageActionsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      config: {
        operationType: 'reload',
      },
      phase: PHASE_CONFIG
    }
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Container>
          { this.renderHeader() }
          { this.renderIntro() }
          { this.renderContent() }
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

  renderContent(){
    if(this.state.phase === PHASE_CONFIG)
      return this.renderConfigPhase();
    else return null;
  }

  renderConfigPhase(){
    return(
      <ImageForm
        operationType={this.state.config.operationType}
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

  renderButton(){
    return(
      <ModalButton
        callback={() => this.submit()}
        title='Apply'
      />
    )
  }

  submit(){

  }

  onAssignment(assignment){
    this.setState(s => ({...s, config: {...s.config, ...assignment}}));
  }

  static propTypes = {
    ...FULL_DEPLOYMENT
  }
}