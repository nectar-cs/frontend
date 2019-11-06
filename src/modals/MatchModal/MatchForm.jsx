//@flow
import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import MiscUtils from "../../utils/MiscUtils";
import {stacks} from "../../misc/stacks";
import FormComponent from "../../hocs/FormComponent";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";

class MatchFormClass extends React.Component<Props> {

  render(){
    return(
      <Fragment>
        <TextOverLineSubtitle text={'Git and Docker Repos'}/>
        { this.renderGitRemoteInput() }
        { this.renderGitRepoSelect() }
        { this.renderDfPathSelect() }
        { this.renderBuildCtxInput() }
        { this.renderImgRemoteSelect() }
        { this.renderImgRepoSelect() }
        { this.renderFrameworkSelect() }
      </Fragment>
    )
  }

  renderGitRemoteInput(){
    if(!this.hasGitRemote()) return null;
    const { gitRemoteChoices } = this.props;

    return this.props.makeSelect(
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
    const { dfPathChoices } = this.props;
    return this.props.makeSelect(
      'Dockerfile Path',
      'dfPath',
      MiscUtils.arrayOptions(dfPathChoices)
    );
  }

  renderBuildCtxInput(){
    if(!this.hasGitRemote()) return null;
    const { dfPathChoices } = this.props;
    return this.props.makeInput(
      "Build Context Path",
      "buildCtxPath",
    )
  }

  renderImgRemoteSelect(){
    if(!this.hasImgRemote()) return null;
    const { imgRemoteChoices } = this.props;
    return this.props.makeSelect(
      'Docker Registry',
      'imgRemoteName',
      MiscUtils.arrayOptions(imgRemoteChoices)
    );
  }

  renderImgRepoSelect(){
    if(!this.hasImgRemote()) return null;
    const { imgRepoChoices } = this.props;

    return this.props.makeSelect(
      'Docker Repository',
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

  hasGitRemote(){ return this.props.gitRemoteChoices.length > 0; }
  hasImgRemote(){ return this.props.imgRemoteChoices.length > 0; }

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

    framework: PropTypes.string,
  };
}

type Props = {
  gitRemoteChoices: Array<string>,
  imgRemoteChoices: Array<string>,
  gitRepoChoices: Array<string>,
  imgRepoChoices: Array<string>,
  dfPathChoices: Array<string>,
  gitRemoteName: string,
  imgRemoteName: string,
  gitRepoName: string,
  buildCtxPath: string,
  imgRepoName: PropTypes.string,
  dfPath: string,
  framework: PropTypes.string,
}

const MatchForm = FormComponent.compose(
  MatchFormClass
);

export default MatchForm;