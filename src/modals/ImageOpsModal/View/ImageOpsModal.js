import React from 'react'
import PropTypes from 'prop-types'
import LeftHeader from "../../../widgets/LeftHeader/LeftHeader";
import Utils from "../../../utils/Utils";
import {Types} from "../../../types/CommonTypes";
import ModalButton from "../../../widgets/Buttons/ModalButton";
import ImageForm from "./ImageForm";
import {ImageActionsModalHelper as Helper} from "./ImageActionsModalHelper";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";
import {defaults} from "./defaults";
import FlexibleModal from "../../../hocs/FlexibleModal";
import TermSection from "../../../widgets/TermSection/TermSection";
import Checklist from "./Checklist";
import Conclusion from "./Conclusion";
import mixpanel from "mixpanel-browser";

const PHASE_CONFIG = 'configuring';
const PHASE_SUBMITTING = 'submitting';
const PHASE_PERFORMING = 'performing';
const PHASE_CONCLUDED = 'concluded';

export default class ImageOpsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      choices: ImageOpsModal.initialChoices(props),
      remotes: ImageOpsModal.initialRemotes(),
      phase: PHASE_CONFIG,
      progressItems: [],
      conclusion: null
    };
    this.submit = this.submit.bind(this);
    this.notifyUpdated = this.notifyUpdated.bind(this);
    this.notifyFinished = this.notifyFinished.bind(this);
  }

  componentDidMount(){
    Utils.mp("Image Operations Start", {});
    Helper.fetchImgTags(this);
    Helper.fetchGitBranches(this);
  }

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
        { this.renderLoader() }
        { this.renderConfigForm() }
        { this.renderGamePlan() }
        { this.renderChecklist() }
        { this.renderConclusion() }
        { this.renderTerminalOutput() }
        { this.renderSubmitButton() }
        { this.renderEditButton() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    const { deployment, mode} = this.props;
    return(
      <LeftHeader
        graphicName={Utils.modalImage(this, "camera_alt")}
        graphicType={Utils.modalGraphicType(this)}
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
    if(this.isWorking() || this.isConcluded()) {
      const { progressItems } = this.state;
      return <Checklist items={progressItems}/>
    } else return null;
  }

  renderTerminalOutput(){
    if(this.isWorking() || this.isConcluded()) {
      if(this.opHelper.supportsLogging()){
        return(
          <TermSection
            title='Logs'
            lines={this.opHelper.jobLogs()}
            extras={{maxHeight: "260px"}}
          />
        )
      }
    }
  }

  renderConclusion(){
    if(!this.isConcluded()) return null;

    return(
      <Conclusion
        success={this.state.conclusion}
        reason={this.opHelper.conclusionMessage()}
      />
    )
  }

  renderConfigForm(){
    if(!this.isConfiguring()) return null;
    const { choices, remotes } = this.state;
    const deployment = this.props.deployment;
    const branchNames = Object.keys(remotes.gitBranches || {});
    const selBranchName = choices.gitBranch;
    const selBranch = Helper.selectedBranchBundle(remotes, selBranchName);

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
        availableCommits={selBranch}
        initialReplicas={deployment.pods.length}
      />
    )
  }

  renderGamePlan(){
    const { remotes, choices } = this.state;
    const runner = this.opHelper;
    const isRunningOrConcluded = !this.isConfiguring();
    const supportsOut = runner && runner.supportsLogging();
    if(isRunningOrConcluded && supportsOut) return null;

    if(['docker', 'git'].includes(choices.operationType))
      if(!remotes.imageTags) return null;

    return(
      <TermSection
        title='Game Plan'
        lines={Helper.previewCommands(this)}
      />
    )
  }

  renderSubmitButton(){
    if(!this.isConfiguring()) return null;

    return(
      <ModalButton
        isEnabled={Helper.isInputValid(this)}
        callback={this.submit}
        title={'Apply'}
      />
    )
  }

  renderEditButton(){
    if(!this.isConcluded()) return null;
    const reset = () => this.setState(s => ({...s, phase: PHASE_CONFIG}));
    return <ModalButton callback={reset} title={'New Operation'}/>;
  }

  submit() {
    const { operationType } = this.state.choices;
    const Operator = Helper.opHelper(operationType);

    const  { deployment, matching } = this.props;
    const { choices } = this.state;

    Utils.mp('Image Operation', {operationType});

    this.opHelper = new Operator({
      ...choices,
      deployment,
      matching,
      commitSha: choices.gitCommit,
      commitMessage: this.selectedGitCommit().message,
      notifyUpdated: this.notifyUpdated,
      notifyFinished: this.notifyFinished
    });

    this.setState(s => ({...s, phase: PHASE_PERFORMING}));
    this.opHelper.perform().then(() => {});
  }

  selectedGitCommit(){
    try{
      const { choices, remotes } = this.state;
      const selBranchName = choices.gitBranch;
      return Helper.selectedCommitBundle(
        remotes,
        selBranchName,
        choices.gitCommit
      );
    } catch {
      return {}
    }
  }

  notifyUpdated(progressItems){
    this.setState(s => ({...s, progressItems}));
    this.broadcastUpstream();
  }

  notifyFinished(conclusion){
    this.setState(s => ({...s, conclusion, phase: PHASE_CONCLUDED }));
    this.broadcastUpstream();
  }

  broadcastUpstream(){
    const broadcast = this.props.refreshCallback;
    if(broadcast) broadcast();
  }

  isSubmitting(){ return this.state.phase === PHASE_SUBMITTING }
  isConfiguring(){ return this.state.phase === PHASE_CONFIG }
  isConcluded(){ return this.state.phase === PHASE_CONCLUDED }
  isWorking(){ return this.state.phase === PHASE_PERFORMING }

  onAssignment(assignment){
    const merged = {...this.state.choices, ...assignment};
    const key = Object.keys(assignment)[0];
    const value = Object.values(assignment)[0];

    if(!Helper.sideEffect(this, key, value))
      this.setState(s => ({...s, choices: merged}));
  }

  static propTypes = {
    deployment: Types.Deployment,
    refreshCallback: PropTypes.func,
    matching: Types.Matching,
    operationType: PropTypes.string
  };

  static initialChoices(props){
    return({
      operationType: Helper.defaultOpType(props),
      imageName: '',
      outImageName: Helper.defOutImageName(props),
      scaleTo: (props.deployment.replicas + 1).toString(),
      imgSource: '',
      gitBranch: '',
      gitCommit: ''
    })
  }

  static initialRemotes(){
    return { imageTags: [], gitBranches: [] };
  }
}