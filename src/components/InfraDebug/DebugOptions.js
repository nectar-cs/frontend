import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import FormComponent from "../../hocs/FormComponent";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import defaults from "./defaults";
import {Types} from "../../types/Deployment";
import MiscUtils from "../../utils/MiscUtils";
import DataUtils from "../../utils/DataUtils";

class DebugOptions extends React.Component {

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

class NetworkDebugOptionsClass extends DebugOptions {

  renderForm(){
    return(
      <Fragment>
        { this.renderServiceSelect() }
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
    serviceChoices: PropTypes.array,
    port: PropTypes.string,
    portChoices: PropTypes.array
  };

  static defaultProps = { service: '', port: '' };
}

const NetworkDebugOptions = FormComponent.compose(
  NetworkDebugOptionsClass
);

export default NetworkDebugOptions;