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
import {defaults} from "./defaults";
import Checklist from "./Checklist";
import ImageReplaceChecklistManager from "./ImageReplaceChecklist";
import {ImageActionsModalHelper as Helper, ReplaceImageHelper} from "./ImageActionsModalHelper";

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
      submitting: false,
      initialPods: [],
      updatedPods: null
    };
    this._isMounted = false;
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  componentDidMount(){
    this._isMounted = true;
    Helper.fetchPods(this, 'initialPods')
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Container>
          { this.renderHeader() }
          { this.renderIntro() }
          { this.renderChecklist() }
          { this.renderConfigPhase() }
          { this.renderPodList() }
          { this.renderButton() }
        </Container>
      </ThemeProvider>
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

  renderIntro(){
    const key = this.state.submitting ? 'postSubmit' : 'preSubmit';
    return(
      <Intro>{defaults.copy.intro[key]}</Intro>
    )
  }

  renderChecklist(){
    if(!this.state.submitting) return;

    return <Checklist
      items={ImageReplaceChecklistManager.generate()}
    />
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

  renderPodList(){
    const pods = ReplaceImageHelper.buildPodList(
      this.state.initialPods,
      this.state.updatedPods
    );

    return(
      <ImageReplaceTable
        pods={pods}
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
    this.setState(s => ({...s, submitting: true}));
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