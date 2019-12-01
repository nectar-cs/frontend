import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import FormComponent from '../../hocs/FormComponent';
import TextOverLineSubtitle from '../../widgets/TextOverLineSubtitle/TextOverLineSubtitle';
import defaults from './defaults';
import Utils from '../../utils/Utils';
import ModalButton from '../../widgets/Buttons/ModalButton';

class DebugOptionsForm extends React.Component {
  render() {
    return (
      <Fragment>
        <TextOverLineSubtitle text={defaults.options.title} />
        {this.renderForm()}
        {this.renderButton()}
      </Fragment>
    );
  }

  makeSelect(title, field, choices) {
    return this.props.makeSelect(title, field, choices);
  }

  renderButton() {
    return <ModalButton callback={this.props.submitCallback} title={defaults.options.submit} />;
  }
}

class NetworkDebugOptionsClass extends DebugOptionsForm {
  renderForm() {
    return (
      <Fragment>
        {this.renderServiceSelect()}
        {this.renderPortsSelect()}
        {this.renderStrategySelect()}
      </Fragment>
    );
  }

  renderStrategySelect() {
    const choices = defaults.options.strategies.network;
    return super.makeSelect(
      'Strategy (stub - coming soon)',
      'strategy',
      Utils.hashOptions(choices),
    );
  }

  renderServiceSelect() {
    return super.makeSelect(
      'Service to Debug',
      'service',
      Utils.hashOptions(this.props.serviceChoices),
    );
  }

  renderPortsSelect() {
    return super.makeSelect('For Port Mapping', 'port', Utils.hashOptions(this.props.portChoices));
  }

  static propTypes = {
    service: PropTypes.string,
    port: PropTypes.number,
    serviceChoices: PropTypes.object.isRequired,
    portChoices: PropTypes.object.isRequired,
    submitCallback: PropTypes.func.isRequired,
  };

  static defaultProps = { service: '', port: '' };
}

const NetworkDebugForm = FormComponent.compose(NetworkDebugOptionsClass);

export default NetworkDebugForm;
