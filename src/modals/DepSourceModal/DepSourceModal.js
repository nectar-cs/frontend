import React from 'react'
import {ModalLayout} from "../../assets/layouts";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import defaults from "./defaults";
import {Types} from "../../types/Deployment";
import HowToAnnotate from "./HowToAnnotate";
import ModalButton from "../../widgets/Buttons/ModalButton";
import Helper from "./Helper";

export default class DepSourceModal extends React.Component {
  render(){
    return(
      <ModalLayout>
        { this.renderHeader() }
        { this.renderHowTo() }
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