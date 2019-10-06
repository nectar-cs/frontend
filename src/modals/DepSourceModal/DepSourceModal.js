import React from 'react'
import {ModalLayout} from "../../assets/layouts";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import defaults from "./defaults";
import {Types} from "../../types/Deployment";
import HowToAnnotate from "./HowToAnnotate";
import ModalButton from "../../widgets/Buttons/ModalButton";
import Helper from "./Helper";
import CommitInfo from "./CommitInfo";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";

export default class DepSourceModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isFetching: false,
      commit: null
    }
  }

  componentDidMount(){
    if(Helper.isAnnotated(this))
      Helper.fetchCommit(this);
  }

  render(){
    return(
      <ModalLayout>
        { this.renderHeader() }
        { this.renderHowTo() }
        { this.renderCommitInfo() }
        { this.renderLoading() }
        { this.renderButton() }
      </ModalLayout>
    )
  }

  renderHeader(){
    const { deployment, matching } = this.props;
    return(
      <LeftHeader
        graphicName={MiscUtils.msImage(deployment, matching)}
        title={defaults.header.title(deployment.name)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderHowTo(){
    if(Helper.isAnnotated(this)) return null;
    return(
      <HowToAnnotate deployment={this.props.deployment}/>
    )
  }

  renderCommitInfo(){
    if(!this.state.commit) return null;

    return(
      <CommitInfo
        commit={this.state.commit}
      />
    )
  }

  renderLoading(){
    if(!this.state.isFetching)  return null;
    return <CenterLoader/>;
  }

  renderButton(){
    if(Helper.isAnnotated(this)) return null;
    return(
      <ModalButton
        callback={() => Helper.goToImageOps(this)}
        title={"Deploy from Git..."}
      />
    )
  }

  static propTypes = {
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}