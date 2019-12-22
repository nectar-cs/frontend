import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Utils from '../../utils/Utils';
import defaults from './defaults';
import { Types } from '../../types/CommonTypes';
import DecisionTree from './DecisionTree';
import NetworkDebugForm from './DebugOptions';
import { LeftHeader } from "@nectar/js-common";

export default class OverviewSide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      execution: null,
      history: {},
    };
  }

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
