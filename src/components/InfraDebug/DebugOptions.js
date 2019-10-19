import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import FormComponent from "../../hocs/FormComponent";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import defaults from "./defaults";
import {Types} from "../../types/Deployment";
import MiscUtils from "../../utils/MiscUtils";
import DataUtils from "../../utils/DataUtils";

class DebugOptionsForm extends React.Component {

  render(){
    return(
      <Fragment>
        <TextOverLineSubtitle text={defaults.options.title} />
        { this.renderForm() }
      </Fragment>
    )
  }

  makeSelect(title, field, choices){
    return this.props.makeSelect(title, field, choices);
  }

  static propTypes = {
    deployment: Types.Deployment.isRequired
  };
}

class NetworkDebugOptionsClass extends DebugOptionsForm {

  renderForm(){
    return(
      <Fragment>
        { this.renderServiceSelect() }
        { this.renderPortsSelect() }
      </Fragment>
    )
  }

  renderServiceSelect(){
    return super.makeSelect(
      'Service to Debug',
      'service',
      MiscUtils.hashOptions(this.props.serviceChoices)
    )
  }

  renderPortsSelect(){
    return super.makeSelect(
      'On Port Mapping',
      'port',
      MiscUtils.hashOptions(this.props.portChoices)
    )
  }

  static propTypes = {
    service: PropTypes.string,
    port: PropTypes.string,
    serviceChoices: PropTypes.object.isRequired,
    portChoices: PropTypes.object.isRequired
  };

  static defaultProps = { service: '', port: '' };
}

const NetworkDebugForm = FormComponent.compose(
  NetworkDebugOptionsClass
);

export default NetworkDebugForm;