//@flow
import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import Utils from "../../utils/Utils";
import {stacks} from "../../vendor/stacks";
import FormComponent from "../../hocs/FormComponent";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";

class MatchFormClass extends React.Component<Props> {

  render(){
    return(
      <Fragment>
        <TextOverLineSubtitle text={'Git Remote'}/>
        { this.renderGitRemoteInput() }
        { this.renderGitRepoSelect() }
        <TextOverLineSubtitle text={'Docker Remote'}/>
        { this.renderImgRemoteSelect() }
        { this.renderImgRepoSelect() }
        <TextOverLineSubtitle text={'Application'}/>
        { this.renderDfPathSelect() }
        { this.renderBuildCtxInput() }
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
      Utils.arrayOptions(gitRemoteChoices)
    );
  }

  renderGitRepoSelect(){
    if(!this.hasGitRemote()) return null;
    const { gitRepoChoices } = this.props;

    return this.props.makeSelect(
      'Git Repository',
      'gitRepoName',
      Utils.arrayOptions(gitRepoChoices)
    );
  }

  renderDfPathSelect(){
    if(!this.hasGitRemote()) return null;
    const { dfPathChoices } = this.props;
    return this.props.makeSelect(
      'Dockerfile Path',
      'dockerfilePath',
      Utils.arrayOptions(dfPathChoices)
    );
  }

  renderBuildCtxInput(){
    if(!this.hasGitRemote()) return null;
    return this.props.makeInput(
      "Build Context Path",
      "dockerBuildPath",
    )
  }

  renderImgRemoteSelect(){
    if(!this.hasImgRemote()) return null;
    const { imgRemoteChoices } = this.props;
    return this.props.makeSelect(
      'Docker Registry',
      'imgRemoteName',
      Utils.arrayOptions(imgRemoteChoices)
    );
  }

  renderImgRepoSelect(){
    if(!this.hasImgRemote()) return null;
    const { imgRepoChoices } = this.props;

    return this.props.makeSelect(
      'Docker Repository',
      'imgRepoName',
      Utils.arrayOptions(imgRepoChoices)
    );
  }

  renderFrameworkSelect(){
    if(!this.hasGitRemote()) return null;
    return this.props.makeSelect(
      'Framework or Language',
      'framework',
      Utils.arrayOptions(stacks.sort())
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
    dockerfilePath: PropTypes.string,

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
  dockerBuildPath: string,
  imgRepoName: PropTypes.string,
  dockerfilePath: string,
  framework: PropTypes.string,
}

const MatchForm = FormComponent.compose(
  MatchFormClass
);

export default MatchForm;