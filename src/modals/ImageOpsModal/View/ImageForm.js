import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import In from '../../../assets/input-combos';
import { S } from './ImageFormStyles';
import Utils from '../../../utils/Utils';
import CenterAnnouncement from '../../../widgets/CenterAnnouncement/CenterAnnouncement';
import { defaults } from './defaults';
import IntegrationsModal from '../../IntegrationsModal/IntegrationsModal';
import { Types } from '../../../types/CommonTypes';
import { ImageActionsModalHelper } from './ImageActionsModalHelper';
import TextOverLineSubtitle from '../../../widgets/TextOverLineSubtitle/TextOverLineSubtitle';
import ModalClientComposer from '../../../hocs/ModalClientComposer';
import { ROUTES } from '../../../containers/RoutesConsts';

export default class ImageForm extends React.Component {
  render() {
    return (
      <Fragment>
        <TextOverLineSubtitle text="Options" />
        {this.renderTypeLine()}
        {this.renderImageNameLine()}
        {this.renderScaleSelector()}
        {this.renderImgTagsSelector()}
        {this.renderGitBranchSelector()}
        {this.renderGitCommitSelector()}
        {this.renderOutImageNameLine()}
        {this.renderDockBlock()}
        {this.renderGitBlock()}
      </Fragment>
    );
  }

  renderTypeLine() {
    return (
      <In.InputLine>
        <In.LineLabel>I want to</In.LineLabel>
        <In.LineInput
          as="select"
          value={this.props.operationType}
          onChange={e => this.onAssignment('operationType', e)}
        >
          {ImageForm.operationTypeOptions()}
        </In.LineInput>
      </In.InputLine>
    );
  }

  renderImageNameLine() {
    if (this.props.operationType !== 'change') return null;

    return (
      <In.InputLine>
        <In.LineLabel>Image Name</In.LineLabel>
        <In.LineInput
          disabled={this.props.operationType !== 'change'}
          value={this.props.imageName}
          onChange={e => this.onAssignment('imageName', e)}
        />
      </In.InputLine>
    );
  }

  renderScaleSelector() {
    if (this.props.operationType !== 'scale') return null;

    return (
      <In.InputLine>
        <In.LineLabel>Scale to</In.LineLabel>
        <In.LineInput
          as="select"
          value={this.props.scaleTo}
          onChange={e => this.onAssignment('scaleTo', e)}
        >
          {Utils.arrayOfHashesOptions(this.scaleOptions())}
        </In.LineInput>
      </In.InputLine>
    );
  }

  renderImgTagsSelector() {
    if (this.props.operationType !== 'docker') return null;
    if (!this.props.availableTags) return null;

    return (
      <In.InputLine>
        <In.LineLabel>Image</In.LineLabel>
        <In.LineInput
          as="select"
          value={this.props.imageTag}
          onChange={e => this.onAssignment('imageTag', e)}
        >
          {Utils.arrayOptions(this.props.availableTags)}
        </In.LineInput>
      </In.InputLine>
    );
  }

  renderGitBranchSelector() {
    if (this.props.operationType !== 'git') return null;
    if (!this.props.availableBranches) return null;

    return (
      <In.InputLine>
        <In.LineLabel>Branch</In.LineLabel>
        <In.LineInput
          as="select"
          value={this.props.gitBranch}
          onChange={e => this.onAssignment('gitBranch', e)}
        >
          {Utils.arrayOptions(this.props.availableBranches)}
        </In.LineInput>
      </In.InputLine>
    );
  }

  renderGitCommitSelector() {
    if (this.props.operationType !== 'git') return null;
    if (!this.props.availableCommits) return null;

    return (
      <In.InputLine>
        <In.LineLabel>Commit</In.LineLabel>
        <In.LineInput
          as="select"
          value={this.props.gitCommit}
          onChange={e => this.onAssignment('gitCommit', e)}
        >
          {Utils.arrayOfHashesOptions(this.commitOptions())}
        </In.LineInput>
      </In.InputLine>
    );
  }

  renderOutImageNameLine() {
    if (this.props.operationType !== 'git') return null;
    if (!this.props.availableCommits) return null;

    return (
      <In.InputLine>
        <In.LineLabel>Output Image</In.LineLabel>
        <In.LineInput
          value={this.props.outImageName}
          onChange={e => this.onAssignment('outImageName', e)}
        />
      </In.InputLine>
    );
  }

  renderDockBlock() {
    if (this.props.operationType !== 'docker') return null;
    if (this.props.availableTags) return null;
    const args = { remoteType: 'Docker', remoteEntity: 'registry' };
    return <BlockPrompt openSection={this.props.openSection} {...args} />;
  }

  renderGitBlock() {
    const { operationType, availableBranches, availableTags } = this.props;
    if (operationType === 'git') {
      if (availableBranches && availableTags) return null;

      const args = { remoteType: 'Git & Docker', remoteEntity: 'repo and a registry' };
      return <BlockPrompt openSection={this.props.openSection} {...args} />;
    } else return null;
  }

  onAssignment(name, event) {
    const setting = { [name]: event.target.value.toString() };
    this.props.onAssignment(setting);
  }

  commitOptions() {
    return this.props.availableCommits.map(commit => ({
      value: commit.sha,
      show: ImageActionsModalHelper.commitToS(commit),
    }));
  }

  scaleOptions() {
    const initial = this.props.initialReplicas;
    const remover = it => (it.value === initial ? null : it);
    const text = i => `${i} Pods ${i === 0 ? '(Shut down)' : ''}`;
    const maker = (v, i) => remover({ show: text(i), value: i });
    return Array.from({ length: 20 }, maker).filter(op => op);
  }

  static operationTypeOptions() {
    return Utils.hashOptions({
      reload: 'Force pull & apply an image with the same name',
      change: 'Supply a new image name',
      scale: 'Scale the number of pods',
      docker: 'Apply a different image from the same registry',
      git: 'Build & apply an image from a git remote',
    });
  }

  static propTypes = {
    onAssignment: PropTypes.func.isRequired,
    operationType: PropTypes.string.isRequired,
    scaleTo: PropTypes.string.isRequired,
    initialReplicas: PropTypes.number.isRequired,
    imageName: PropTypes.string,
    outImageName: PropTypes.string,
    imageTag: PropTypes.string,
    gitBranch: PropTypes.string,
    gitCommit: PropTypes.string,
    availableTags: PropTypes.arrayOf(PropTypes.string),
    availableBranches: PropTypes.arrayOf(PropTypes.string),
    availableCommits: PropTypes.arrayOf(Types.Commit),
  };
}

function BlockPromptFunc(props) {
  const replaceModal = props.openModal;
  const connAction = () => replaceModal(IntegrationsModal);
  const bindPath = ROUTES.bulkMatch.index.path;

  const l1 = defaults.els.blockedConn(connAction, props.remoteType);
  const l2 = defaults.els.blockedBind(bindPath, props.remoteEntity);

  const icon = defaults.els.blockedIcon;

  return (
    <CenterAnnouncement iconName={icon} contentType="children" light={true}>
      <S.NoDockerOne>{l1}</S.NoDockerOne>
      <S.NoDockerOne>{l2}</S.NoDockerOne>
    </CenterAnnouncement>
  );
}

const BlockPrompt = ModalClientComposer.compose(BlockPromptFunc);

BlockPromptFunc.propTypes = {
  replaceModal: PropTypes.func.isRequired,
  remoteType: PropTypes.string.isRequired,
  remoteEntity: PropTypes.string.isRequired,
};
