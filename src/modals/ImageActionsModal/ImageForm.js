import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {InputLine, LineInput, LineLabel} from "../../assets/input-combos";
import { S } from './ImageFormStyles'
import MiscUtils from "../../utils/MiscUtils";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import {defaults} from "./defaults";
import {ROUTES} from "../../containers/RoutesConsts";
import IntegrationsModal from "../IntegrationsModal/IntegrationsModal";
import {Types} from "../../types/Deployment";
import {ImageActionsModalHelper} from "./ImageActionsModalHelper";

export default class ImageForm extends React.Component {
  render(){
    return(
      <Fragment>
        { this.renderTypeLine() }
        { this.renderImageNameLine() }
        { this.renderScaleSelector() }
        { this.renderImgTagsSelector() }
        { this.renderGitBranchSelector() }
        { this.renderGitCommitSelector() }
        { this.renderDockBlock() }
        { this.renderGitBlock() }
      </Fragment>
    )
  }

  renderTypeLine(){
    return(
      <InputLine>
        <LineLabel>I want to</LineLabel>
        <LineInput
          as='select'
          value={this.props.operationType}
          onChange={(e) => this.onAssignment('operationType', e)}>
          { ImageForm.operationTypeOptions() }
        </LineInput>
      </InputLine>
    )
  }

  renderImageNameLine(){
    if(this.props.operationType !== 'change') return null;

    return(
      <InputLine>
        <LineLabel>Image Name</LineLabel>
        <LineInput
          disabled={this.props.operationType !== 'change'}
          value={this.props.imageName}
          onChange={(e) => this.onAssignment('imageName', e)}/>
      </InputLine>
    )
  }

  renderScaleSelector(){
    if(this.props.operationType !== 'scale') return null;

    return(
      <InputLine>
        <LineLabel>Scale to</LineLabel>
        <LineInput
          as='select'
          value={this.props.scaleTo}
          onChange={(e) => this.onAssignment('scaleTo', e)}>
          { MiscUtils.arrayOfHashesOptions(this.scaleOptions()) }
        </LineInput>
      </InputLine>
    )
  }

  renderImgTagsSelector(){
    if(this.props.operationType !== 'docker') return null;
    if(!this.props.availableTags) return null;

    return(
      <InputLine>
        <LineLabel>Image</LineLabel>
        <LineInput
          as='select'
          value={this.props.imageTag}
          onChange={(e) => this.onAssignment('imageTag', e)}>
          { MiscUtils.arrayOptions(this.props.availableTags) }
        </LineInput>
      </InputLine>
    )
  }

  renderGitBranchSelector(){
    if(this.props.operationType !== 'git') return null;
    if(!this.props.availableBranches) return null;

    return(
      <InputLine>
        <LineLabel>Branch</LineLabel>
        <LineInput
          as='select'
          value={this.props.gitBranch}
          onChange={(e) => this.onAssignment('gitBranch', e)}>
          { MiscUtils.arrayOptions(this.props.availableBranches) }
        </LineInput>
      </InputLine>
    )
  }

  renderGitCommitSelector(){
    if(this.props.operationType !== 'git') return null;
    if(!this.props.availableCommits) return null;

    return(
      <InputLine>
        <LineLabel>Commit</LineLabel>
        <LineInput
          as='select'
          value={this.props.gitCommit}
          onChange={(e) => this.onAssignment('gitCommit', e)}>
          { MiscUtils.arrayOfHashesOptions(this.commitOptions()) }
        </LineInput>
      </InputLine>
    )
  }

  renderDockBlock(){
    if(this.props.operationType !== 'docker') return null;
    if(this.props.availableTags) return null;
    const args = { remoteType:'Docker', remoteEntity: 'registry' };
    return <BlockPrompt {...args} replaceModal={this.props.replaceModal} />;
  }

  renderGitBlock(){
    if(this.props.operationType !== 'git') return null;
    if(this.props.availableBranches) return null;
    const args = { remoteType: 'Git', remoteEntity: 'repo' };
    return <BlockPrompt {...args} replaceModal={this.props.replaceModal} />;
  }

  onAssignment(name, event){
    const setting = { [name]: event.target.value.toString() };
    this.props.onAssignment(setting);
  }

  commitOptions(){
    return this.props.availableCommits.map(commit => ({
      value: commit.sha,
      show: ImageActionsModalHelper.commitToS(commit)
    }));
  }

  scaleOptions(){
    const initial = this.props.initialReplicas;
    const remover = (it) => it.value === initial ? null : it;
    const text = (i) => `${i} Pods ${i === 0 ? '(Shut down)' : ''}`;
    const maker = (v, i) => remover({ show: text(i), value: i });
    return Array.from({length: 20}, maker).filter(op => op);
  }

  static operationTypeOptions(){
    return MiscUtils.hashOptions({
      reload: "Force pull & apply an image with the same name",
      change: "Supply a new image name",
      scale: "Scale the number of pods",
      docker: "Choose a docker image from your remote registry",
      git: "Build an image from a git remote"
    })
  }

  static propTypes = {
    onAssignment: PropTypes.func.isRequired,
    operationType: PropTypes.string.isRequired,
    scaleTo: PropTypes.string.isRequired,
    initialReplicas: PropTypes.number.isRequired,
    imageTag: PropTypes.string,
    gitBranch: PropTypes.string,
    gitCommit: PropTypes.string,
    availableTags: PropTypes.arrayOf(PropTypes.string),
    availableBranches: PropTypes.arrayOf(PropTypes.string),
    replaceModal: PropTypes.func.isRequired,
    availableCommits: PropTypes.arrayOf(Types.Commit),
  }
}

function BlockPrompt(props){
  const replaceModal = props.replaceModal;
  const bindPath = ROUTES.deployments.detect.path;
  const connAction = () => replaceModal(IntegrationsModal);

  const l1 = defaults.els.blockedConn(connAction, props.remoteType);
  const l2 = defaults.els.blockedBind(bindPath, props.remoteEntity);
  const icon = defaults.els.blockedIcon;

  return(
    <CenterAnnouncement iconName={icon} contentType='children' light={true}>
      <S.NoDockerOne>{l1}</S.NoDockerOne>
      <S.NoDockerOne>{l2}</S.NoDockerOne>
    </CenterAnnouncement>
  )
}

BlockPrompt.propTypes = {
  replaceModal: PropTypes.func.isRequired,
  remoteType: PropTypes.string.isRequired,
  remoteEntity: PropTypes.string.isRequired
};