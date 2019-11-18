import React from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import {Types} from "../../types/CommonTypes";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import Utils from "../../utils/Utils";
import Tabs from "../../widgets/Tabs/Tabs";
import defaults from "./defaults";
import PodProblems from "./PodProblems";

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
        subtitle={defaults.header.subtitle(deployment.name)}
        graphicType='icon'
      />
    )
  }

  renderTabs(){
    const { pod } = this.props;
    const defInd = pod.state === 'Error' ? 1 : 0;
    return(
      <Tabs tabs={defaults.tabs} defaultIndex={defInd}>
        <p>Overview Iz not built yet</p>
        <PodProblems pod={pod}/>
        <p>Perf Iz not built yet</p>
        <p>Logs Iz not built yet</p>
      </Tabs>
    )
  }

  static propTypes = {
    pod: Types.LightPod,
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}