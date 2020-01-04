import React from 'react';
import FlexibleModal from '../../hocs/FlexibleModal';
import type { Deployment } from '../../types/Types';
import ResourceLogs from '../../widgets/ResourceLogs/ResourceLogs';
import Utils from '../../utils/Utils';
import LogsForm from './LogsForm';
import defaults from './defaults';
import { LeftHeader } from "nectar-cs-js-common";

export default class DeploymentLogsModal extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      podName: defaultPodName(props),
      sinceMinutes: 10,
      sinceSeconds: 0,
    };
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    Utils.mp('Read Logs', {});
  }

  render() {
    return (
      <FlexibleModal mode={this.props.mode}>
        {this.renderHeader()}
        {this.renderLogsForm()}
        {this.renderLogs()}
      </FlexibleModal>
    );
  }

  renderHeader() {
    const { deployment, mode } = this.props;
    return (
      <LeftHeader
        graphicName={Utils.modalImage(this, 'format_list_bulleted')}
        title={defaults.header.title(deployment.name, mode)}
        subtitle={defaults.header.subtitle}
        graphicType={Utils.modalGraphicType(this)}
      />
    );
  }

  renderLogsForm() {
    const { pods } = this.props.deployment;
    const { sinceMinutes, sinceSeconds, podName } = this.state;
    return (
      <LogsForm
        podNameChoices={pods.map(p => p.name)}
        selectedPodName={podName}
        sinceMinutes={sinceMinutes}
        sinceSeconds={sinceSeconds}
        notifyFormValueChanged={this.update}
      />
    );
  }

  renderLogs() {
    const { deployment } = this.props;
    const { sinceMinutes, sinceSeconds, podName } = this.state;
    return (
      <ResourceLogs
        namespace={deployment.namespace}
        podName={podName}
        sinceMinutes={sinceMinutes}
        sinceSeconds={sinceSeconds}
      />
    );
  }

  update(key, value) {
    this.setState(s => ({ ...s, [key]: value }));
  }
}

function defaultPodName(props) {
  return Utils.tor(() => props.deployment.pods[0].name, '');
}

type Props = {
  mode: 'fragment' | 'modal',
  deployment: Deployment,
};
