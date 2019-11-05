import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import MiscUtils from "../../utils/MiscUtils";
import {stacks} from "../../misc/stacks";
import FormComponent from "../../hocs/FormComponent";

class MatchFormClass extends React.Component {

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
    if(!this.hasGitRemote()) return null;
    const { gitRemoteChoices } = this.props;

    this.props.makeSelect(
      'Git Remote',
      'gitRemoteName',
      MiscUtils.arrayOptions(gitRemoteChoices)
    );
  }

  renderGitRepoSelect(){
    if(!this.hasGitRemote()) return null;
    const { gitRepoChoices } = this.props;

    return this.props.makeSelect(
      'Git Repository',
      'gitRepoName',
      MiscUtils.arrayOptions(gitRepoChoices)
    );
  }

  renderDfPathSelect(){
    if(!this.hasGitRemote()) return null;
    if(!this.props.hasGitRemote) return null;
    const { dfPathChoices } = this.props;
    return this.props.makeSelect(
      'Dockerfile Path',
      'dfPath',
      MiscUtils.arrayOptions(dfPathChoices)
    );
  }

  renderImgRemoteSelect(){
    if(!this.hasImgRemote()) return null;
    const { imgRemoteChoices } = this.props;
    return this.props.makeSelect(
      'Image Registry',
      'imgRemoteName',
      MiscUtils.arrayOptions(imgRemoteChoices)
    );
  }

  renderImgRepoSelect(){
    if(!this.hasImgRemote()) return null;
    if(!this.props.hasImageRegistry) return null;
    const { imgRepoChoices } = this.props;

    return this.props.makeSelect(
      'Image Repo',
      'imgRepoName',
      MiscUtils.arrayOptions(imgRepoChoices)
    );
  }

  renderFrameworkSelect(){
    return this.props.makeSelect(
      'Framework or Language',
      'framework',
      MiscUtils.arrayOptions(stacks.sort())
    );
  }

  hasGitRemote(){ return this.props.gitRemoteChoices != null; }
  hasImgRemote(){ return this.props.imgRemoteChoices != null; }

  static propTypes = {
    gitRemoteChoices: PropTypes.array,
    imgRemoteChoices: PropTypes.array,
    gitRepoChoices: PropTypes.array,
    imgRepoChoices: PropTypes.array,
    dfPathChoices: PropTypes.array,

    gitRemoteName: PropTypes.string,
    imgRemoteName: PropTypes.string,
    dfPath: PropTypes.string,

    gitRepoName: PropTypes.string,
    imgRepoName: PropTypes.string,

    deployment: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  };
}

const MatchForm = FormComponent.compose(
  MatchFormClass
);

export default MatchForm;