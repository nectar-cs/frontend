import React from 'react';
import FlexibleModal from '../../hocs/FlexibleModal';
import { Types } from '../../types/CommonTypes';
import Utils from '../../utils/Utils';
import defaults from './defaults';
import PodOverview from './PodOverview';
import { LeftHeader, Tabs } from "nectar-cs-js-common";

export default class PodModal extends React.Component {
  render() {
    return (
      <FlexibleModal mode={this.props.mode}>
        {this.renderHeader()}
        {this.renderTabs()}
      </FlexibleModal>
    );
  }

  componentDidMount() {
    Utils.mp('Pod Modal Start', {});
  }

  renderHeader() {
    const { mode, pod, deployment } = this.props;
    const { namespace: ns, name } = pod;
    return (
      <LeftHeader
        graphicName="child_friendly"
        title={defaults.header.title(mode, ns, name)}
        subtitle={defaults.header.subtitle(deployment.name)}
        graphicType="icon"
      />
    );
  }

  renderTabs() {
    const { pod, mode } = this.props;
    const defInd = pod.state === 'Error' ? 0 : 0;
    return (
      <Tabs tabs={defaults.tabs} defaultIndex={defInd}>
        <PodOverview pod={pod} mode={mode} />
        <p>Not done :/</p>
        <p>Not done :/</p>
        <p>Not done :/</p>
      </Tabs>
    );
  }

  static propTypes = {
    pod: Types.LightPod,
    deployment: Types.Deployment,
    matching: Types.Matching,
  };
}
