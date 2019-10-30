import React from 'react'
import PropTypes from 'prop-types'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import {Types} from "../../types/Deployment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import ImageForm from "./ImageForm";
import {ImageActionsModalHelper as Helper} from "./ImageActionsModalHelper";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import {defaults} from "./defaults";
import FlexibleModal from "../../hocs/FlexibleModal";
import TermSection from "../../widgets/TermSection/TermSection";

const PHASE_CONFIG = 'configuring';
const PHASE_SUBMITTING = 'submitting';
const PHASE_SUBMITTED = 'submitted';
const PHASE_CONCLUDED = 'concluded';

export default class ImageOpsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      choices: ImageOpsModal.initialChoices(props),
      remotes: ImageOpsModal.initialRemotes(),
      phase: PHASE_CONFIG,
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount(){
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
        { this.renderSubmitButton() }
        { this.renderEditButton() }
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
    // const { initialPods, updatedPods } = this.state;
    // const items = this.opHelper.progressItems(initialPods, updatedPods);
    // return <Checklist items={items}/>
    return <p>Checklist lol</p>;
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
    if(!this.isConfiguring()) return null;
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
    return <ModalButton callback={this.submit} title={'New Operation'}/>;
  }

  submit() {
    console.log("HEHHELLOOOOO");
    const { operationType } = this.state.choices;
    const Operator = Helper.opHelper(operationType);

    const  { deployment, matching } = this.props;
    const bundle = { deployment, matching, ...this.state.choices };
    this.opHelper = new Operator(bundle);

    console.log(this.opHelper);
    this.opHelper.perform();
    console.log("Hey i'm free from perform!")
  }

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

  // notifySubscribers(){
  //   const broadcast = this.props.refreshCallback;
  //   if(broadcast) broadcast();
  // }

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