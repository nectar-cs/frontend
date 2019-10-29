import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import {Types} from "../../types/Deployment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import ImageForm from "./ImageForm";
import Kapi from "../../utils/Kapi";
import Checklist from "./Checklist";
import {ImageActionsModalHelper as Helper} from "./ImageActionsModalHelper";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import Conclusion from "./Conclusion";
import {defaults} from "./defaults";
import FlexibleModal from "../../hocs/FlexibleModal";
import Layout from "../../assets/layouts";
import Text from "./../../assets/text-combos"
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";
import TermSection from "../../widgets/TermSection/TermSection";

const PHASE_CONFIG = 'configuring';
const PHASE_SUBMITTING = 'submitting';
const PHASE_SUBMITTED = 'submitted';
const PHASE_CONCLUDED = 'concluded';

export default class ImageOpsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      choices: {
        operationType: Helper.defOpType(props),
        imageName: '',
        outImageName: Helper.defOutImageName(props),
        scaleTo: (props.deployment.replicas + 1).toString(),
        imgSource: '',
        gitBranch: '',
        gitCommit: ''
      },
      remotes: {
        imageTags: [],
        gitBranches: []
      },
      phase: PHASE_CONFIG,
      initialPods: [],
      updatedPods: null,
      conclusion: null,
      conclusionReason: null,
      buildJobId: null,
      termOutput: [],
      job: {
        id: null,
        state: null,
        output: null
      }
    };

    this._isMounted = true;
    this.repeater = this.repeater.bind(this);
    this.reloadPods = this.reloadPods.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
    this.submit = this.submit.bind(this);
    this.config = this.config.bind(this);
  }

  componentDidMount(){
    Helper.fetchPods(this, 'initialPods');
    Helper.fetchImgTags(this);
    Helper.fetchGitBranches(this);
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
        { this.renderLoader() }
        { this.renderConfigForm() }
        { this.renderGamePlan() }
        { this.renderChecklist() }
        { this.renderTermOutput() }
        { this.renderConclusion() }
        { this.renderPodList() }
        { this.renderButton() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    const { deployment, mode} = this.props;
    return(
      <LeftHeader
        graphicName={MiscUtils.modalImage(this, "camera_alt")}
        graphicType={MiscUtils.modalGraphicType(this)}
        title={defaults.header.title(deployment.name, mode)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderLoader(){
    if(this.isSubmitting())
      return <CenterLoader/>;
    else return null;
  }

  renderChecklist(){
    if(!(this.isSubmitted() || this.isConcluded())) return null;
    const { initialPods, updatedPods } = this.state;
    const opHelper = Helper.opHelper(this);
    const items = opHelper.progressItems(initialPods, updatedPods);
    return <Checklist items={items}/>
  }

  renderConclusion(){
    if(!this.isConcluded()) return null;

    const opHelper = Helper.opHelper(this);
    const reason = opHelper.successMessage();

    return(
      <Conclusion
        isSuccess={true}
        reason={reason}
      />
    )
  }

  renderConfigForm(){
    if(!this.isConfiguring()) return null;
    const { choices, remotes } = this.state;
    const deployment = this.props.deployment;
    const branchNames = Object.keys(remotes.gitBranches || {});

    return(
      <ImageForm
        onAssignment={(a) => this.onAssignment(a)}
        operationType={choices.operationType}
        scaleTo={choices.scaleTo}
        imageTag={choices.imgSource}
        gitBranch={choices.gitBranch}
        gitCommit={choices.gitCommit}
        availableTags={remotes.imageTags}
        outImageName={choices.outImageName}
        availableBranches={remotes.gitBranches ? branchNames : null}
        availableCommits={this.selBranchObj()}
        initialReplicas={deployment.replicas}
        replaceModal={this.props.replaceModal}
      />
    )
  }

  renderGamePlan(){
    if(!this.isConfiguring()) return null;
    return(
      <TermSection
        title='Game Plan'
        lines={Helper.previewCommands(this)}
      />
    )
  }

  renderTermOutput(){
    if(!this.isSubmitted()) return null;
    if(!Helper.opHelper(this).hasTermOutput()) return null;
    const { output } = this.state.job;
    return <TermSection title={'Execution'} lines={output}/>;
  }

  renderPodList(){
    if(this.isConfiguring()) return null;
    if(this.isSubmitting()) return null;
    const podsFilter = Helper.opHelper(this);
    const pods = podsFilter.buildPodList();
    const PodTableRenderer = Helper.podsRenderer(this);
    return <PodTableRenderer pods={pods}/>;
  }

  renderButton(){
    const valid = Helper.isInputValid(this);
    const enabled = (this.isConfiguring() && valid) || this.isConcluded();
    const callback = this.isConfiguring() ? this.submit : this.config;
    const text = this.isConfiguring() ? "Apply" : "New Operation";
    return <ModalButton isEnabled={enabled} callback={callback} title={text}/>
  }

  onFailure(){
    this.setState(s => ({...s,  phase: PHASE_SUBMITTED}));
  }

  onSuccess(){
    this.setState(s => ({...s, phase: PHASE_SUBMITTED}));
    this.reloadPods(true);
    this.notifySubscribers();
  }

  submit() {
    if(this.state.choices.operationType === 'git'){
      this.setState(s => ({...s, phase: PHASE_SUBMITTED}));
      Helper.submitBuildFromGit(this);
    } else {
      this.setState(s => ({...s, phase: PHASE_SUBMITTING}));
      Helper.performImageOp(this);
    }
  }

  repeater(updatedPods){
    const result = this.tryHaltingReloadLoop(updatedPods);

    if(result){
      this.setState(s => ({...s, ...result}));
      this.notifySubscribers();
    } else {
      setTimeout(this.reloadPods, 1000);
    }
  }

  tryHaltingReloadLoop(){
    const opHelper = Helper.opHelper(this);
    let conclusion = null, reason = null;

    if(opHelper.isStableState()) {
      conclusion = false;
      reason = 'Implement me';
    }

    else if(opHelper.isStableState()) {
      conclusion = true;
      reason = opHelper.successMessage();
    }
    return { conclusion, reason};
  }

  pullProgressData(force){
    if(force || this.isSubmitted()){
      if(2) {
        Helper.fetchPods(this, 'updatedPods', this.repeater)
      } else {
        Helper.submitBuildFromGit()
      }
    }
  }

  reloadPods(force){
    if(force || this.isSubmitted()){
      Helper.fetchPods(this, 'updatedPods', this.repeater)
    }
  }

  reloadBuildJob(){
  }

  config(){ this.setState(s => ({...s, phase: PHASE_CONFIG})); }
  isSubmitting(){ return this.state.phase === PHASE_SUBMITTING }
  isConfiguring(){ return this.state.phase === PHASE_CONFIG }
  isConcluded(){ return this.state.phase === PHASE_CONCLUDED }
  isSubmitted(){ return this.state.phase === PHASE_SUBMITTED }

  onAssignment(assignment){
    const merged = {...this.state.choices, ...assignment};
    const key = Object.keys(assignment)[0];
    const value = Object.values(assignment)[0];

    if(!Helper.sideEffect(this, key, value))
      this.setState(s => ({...s, choices: merged}));
  }

  selBranchObj(){
    const { gitBranches } = this.state.remotes;
    if(!gitBranches) return null;
    return gitBranches[this.state.choices.gitBranch];
  }

  notifySubscribers(){
    const broadcast = this.props.refreshCallback;
    if(broadcast) broadcast();
  }

  static propTypes = {
    deployment: Types.Deployment,
    refreshCallback: PropTypes.func,
    matching: Types.Matching,
    operationType: PropTypes.string
  };
}