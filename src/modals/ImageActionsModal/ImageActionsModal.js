import React, {Fragment} from 'react'
import {Container, Intro} from "./ImageActionsModalStyles";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import {FULL_DEPLOYMENT} from "../../types/Deployment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import ImageForm from "./ImageForm";
import {ThemeProvider} from "styled-components";
import {theme} from "../../assets/constants";
import Kapi from "../../utils/Kapi";
import {defaults} from "./defaults";
import Checklist from "./Checklist";
import ImageReplaceChecklistManager from "./ImageReplaceChecklist";
import {ImageActionsModalHelper as Helper} from "./ImageActionsModalHelper";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";

const PHASE_CONFIG = 'configuring';
const PHASE_SUBMITTING = 'submitting';
const PHASE_SUBMITTED = 'submitted';
const PHASE_CONCLUDED = 'concluded';

export default class ImageActionsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      config: {
        operationType: 'reload',
        imageName: props.deployment.imageName
      },
      phase: PHASE_CONFIG,
      initialPods: [],
      updatedPods: null
    };
    this._isMounted = true;
    this.reloadPods = this.reloadPods.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  componentDidMount(){
    Helper.fetchPods(this, 'initialPods')
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Container>
          { this.renderHeader() }
          { this.renderLoader() }
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

  renderLoader(){
    if(this.isSubmitting())
      return <CenterLoader/>;
    else return null;
  }

  renderIntro(){
    if(this.isSubmitting()) return null;
    const introCopy = defaults.copy.intro.preSubmit;

    return(
      <Fragment>
        <TextOverLineSubtitle text='Options'/>
        {  this.isConfiguring() ? <Intro>{introCopy}</Intro> : null }
      </Fragment>
    )
  }

  renderChecklist(){
    if(this.isSubmitted() || this.isConcluded()){
      return <Checklist
        items={ImageReplaceChecklistManager.generate()}
      />
    } else return null;
  }

  renderConfigPhase(){
    if(!this.isConfiguring()) return null;
    return(
      <ImageForm
        operationType={this.state.config.operationType}
        imageName={this.state.config.imageName}
        onAssignment={(a) => this.onAssignment(a)}
      />
    )
  }

  renderPodList(){
    if(this.isSubmitting()) return null;
    const { initialPods, updatedPods } = this.state;
    const podsFilter = Helper.podSource(this);
    const pods = podsFilter.buildPodList(initialPods, updatedPods);
    const PodTableRenderer = Helper.podsRenderer(this);
    return <PodTableRenderer pods={pods}/>;
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
    this.setState(s => ({...s,  phase: PHASE_SUBMITTED}));
  }

  onSuccess(){
    console.log("Success");
    this.setState(s => ({...s, phase: PHASE_SUBMITTED}));
  }

  submit() {
    const payload = {
      dep_namespace: this.props.deployment.namespace,
      dep_name: this.props.deployment.name
    };

    const endpoint = '/api/run/image_reload';
    this.setState(s => ({...s, phase: PHASE_SUBMITTING}));
    Kapi.post(endpoint, payload, this.onSuccess, this.onFailure);
    this.reloadPods(true);
  }

  reloadPods(force){
    if(force || this.isSubmitted()){
      let repeat = () => setTimeout(this.reloadPods, 1000);
      Helper.fetchPods(this, 'updatedPods', repeat)
    }
  }

  isSubmitting(){ return this.state.phase === PHASE_SUBMITTING }
  isConfiguring(){ return this.state.phase === PHASE_CONFIG }
  isConcluded(){ return this.state.phase === PHASE_CONCLUDED }
  isSubmitted(){ return this.state.phase === PHASE_SUBMITTED }
  isReload() { return this.state.config.operationType === 'reload' }

  onAssignment(assignment){
    const merged = {...this.state.config, ...assignment};
    this.setState(s => ({...s, config: merged}));
  }

  static propTypes = {
    ...FULL_DEPLOYMENT
  }
}