import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {FormHelper as H} from "./FormHelper";
import In from "../../../assets/input-combos";
import MiscUtils from "../../../utils/MiscUtils";

export default class MatchForm extends React.Component {

  render(){
    return(
      <Fragment>
        { this.renderGitRemoteInput() }
        { this.renderGitRepoSelect() }
        { this.renderDfPathSelect() }
        { this.renderImgRemoteSelect() }
        { this.renderImgRepoSelect() }
        { this.renderFrameworkSelect() }
      </Fragment>
    )
  }

  renderGitRemoteInput(){
    if(!this.props.hasGitRemote) return null;
    return this.makeSelect(
      'Git Remote',
      'gitRemoteName',
      H.remoteOptions(this.props.gitRemoteList)
    );
  }

  renderGitRepoSelect(){
    if(!this.props.hasGitRemote) return null;
    const { gitRemoteList, gitRemoteName } = this.props;
    return this.makeSelect(
      'Git Repository',
      'gitRepoName',
      H.repoOptions(gitRemoteList, gitRemoteName)
    );
  }

  renderDfPathSelect(){
    if(!this.props.hasGitRemote) return null;
    const { dfPathList } = this.props;
    return this.makeSelect(
      'Dockerfile Path',
      'dfPath',
      MiscUtils.arrayOptions(dfPathList)
    );
  }

  renderImgRemoteSelect(){
    if(!this.props.hasImageRegistry) return null;

    return this.makeSelect(
      'Image Registry',
      'imgRemoteName',
      H.remoteOptions(this.props.imgRemoteList)
    );
  }

  renderImgRepoSelect(){
    if(!this.props.hasImageRegistry) return null;
    const { imgRemoteList, imgRemoteName } = this.props;

    return this.makeSelect(
      'Image Repo',
      'imgRepoName',
      H.repoOptions(imgRemoteList, imgRemoteName)
    );
  }

  renderFrameworkSelect(){
    return this.makeSelect(
      'Framework or Language',
      'framework',
      H.frameworkOptions()
    );
  }

  makeSelect(title, field, choices){
    const callback = (e) => {
      this.props.notifyChanged(field, e.target.value);
    };

    return(
      <In.InputLine>
        <In.LineLabel size='large'>{title}</In.LineLabel>
        <In.LineInput
          as='select'
          value={this.props[field]}
          onChange={(e) => callback(e)}>
          { choices }
        </In.LineInput>
      </In.InputLine>
    )
  }

  static propTypes = {
    hasGitRemote: PropTypes.bool.isRequired,
    hasImageRegistry: PropTypes.bool.isRequired,

    gitRemoteList: PropTypes.array,
    imgRemoteList: PropTypes.array,
    dfPathList: PropTypes.array,

    gitRemoteName: PropTypes.string,
    imgRemoteName: PropTypes.string,

    dfPath: PropTypes.string,

    gitRepoName: PropTypes.string,
    imgRepoName: PropTypes.string,

    notifyChanged: PropTypes.func.isRequired,
    deployment: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  };
}