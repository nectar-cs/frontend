import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {FormHelper as H} from "./FormHelper";
import {InputLine, LineInput, LineLabel} from "../../../assets/input-combos";

export default class MatchForm extends React.Component {

  render(){
    return(
      <Fragment>
        { this.renderGitRemoteInput() }
        { this.renderGitRepoSelect() }
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
      <InputLine>
        <LineLabel size='large'>{title}</LineLabel>
        <LineInput
          as='select'
          value={this.props[field]}
          onChange={(e) => callback(e)}>
          { choices }
        </LineInput>
      </InputLine>
    )
  }

  static propTypes = {
    hasGitRemote: PropTypes.bool.isRequired,
    hasImageRegistry: PropTypes.bool.isRequired,

    gitRemoteList: PropTypes.array,
    imgRemoteList: PropTypes.array,

    gitRemoteName: PropTypes.string,
    imgRemoteName: PropTypes.string,

    gitRepoName: PropTypes.string,
    imgRepoName: PropTypes.string,

    notifyChanged: PropTypes.func.isRequired,
    deployment: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  };
}