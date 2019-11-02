import React from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import {Types} from "../../types/Deployment";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";

export default class PodModal extends React.Component {

  render(){
    return(
      <FlexibleModal mode='modal'>
        { this.renderHeader() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    const { pod, deployment, matching } = this.props;
    return(
      <LeftHeader
        graphicName={MiscUtils.msImage(deployment, matching)}
        title={`${deployment.namespace} / ${pod.name}`}
        subtitle={`One of ${deployment.name}'s pods.`}
      />
    )
  }

  static propTypes = {
    pod: Types.LightPod,
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}
