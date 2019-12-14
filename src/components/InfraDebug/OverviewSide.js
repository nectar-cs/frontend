import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Types } from '../../types/CommonTypes';
import Utils from '../../utils/Utils';
import LeftHeader from '../../widgets/LeftHeader/LeftHeader';
import NetworkDebugForm from './DebugOptions';
import DecisionTree from './DecisionTree';
import defaults from './defaults';

export default class OverviewSide extends React.Component {
  render() {
    return (
      <Fragment>
        {this.renderHeader()}
        {this.renderOptions()}
        {this.renderTree()}
      </Fragment>
    );
  }

  renderOptions() {
    if (this.props.isConfigDone) return null;

    return (
      <NetworkDebugForm
        deployment={this.props.deployment}
        notifyFormValueChanged={this.props.formCallback}
        submitCallback={this.props.submitCallback}
        {...this.props.formChoices}
      />
    );
  }

  renderTree() {
    if (!this.props.isConfigDone) return null;

    const { semanticTree, crtNodePointer } = this.props;
    return <DecisionTree semanticTree={semanticTree} crtNodePointer={crtNodePointer} />;
  }

  renderHeader() {
    const { deployment, matching } = this.props;
    return (
      <LeftHeader
        graphicName={Utils.msImage(deployment, matching)}
        title={this.config().header.title(deployment.name)}
        subtitle={this.config().header.subtitle}
      />
    );
  }

  config() {
    return defaults.debuggers[this.type()];
  }

  type() {
    return this.props.type;
  }

  static propTypes = {
    deployment: Types.Deployment,
    matching: Types.Matching,
    semanticTree: PropTypes.object.isRequired,
    formCallback: PropTypes.func.isRequired,
    formChoices: PropTypes.object.isRequired,
  };
}
