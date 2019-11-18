import React from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import {Types} from "../../types/CommonTypes";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import Utils from "../../utils/Utils";
import Tabs from "../../widgets/Tabs/Tabs";
import defaults from "./defaults";

export default class PodModal extends React.Component {

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
        { this.renderTabs() }
      </FlexibleModal>
    )
  }

  componentDidMount(){
    Utils.mp("Pod Modal Start", {});
  }

  renderHeader(){
    const { mode, pod, deployment } = this.props;
    const { namespace: ns, name } = pod;
    return(
      <LeftHeader
        graphicName='child_friendly'
        title={defaults.header.title(mode, ns, name)}
        subtitle={`One of ${deployment.name}'s pods.`}
        graphicType='icon'
      />
    )
  }

  renderTabs(){
    return(
      <Tabs tabs={['Status', 'Logs']} selectedInd={0}>
        <p>stat</p>
        <p>log</p>
      </Tabs>
    )
  }

  static propTypes = {
    pod: Types.LightPod,
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}