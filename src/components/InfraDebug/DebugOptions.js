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
    const { services } = this.props.deployment;
    const fmt = DataUtils.aToH(services.map(s => {
      let summary = `${s.type}: ${s.name} - ${s.internalIp} `;
      return {[s.name]: summary};

    }));

    return super.makeSelect(
      'Service to Debug',
      'service',
      MiscUtils.hashOptions(fmt)
    )
  }

  renderPortsSelect(){

  }

  renderStrategySelect(){
    return this.makeSelect(
      "Strategy",
      'strategy',
      MiscUtils.arrayOptions(['Optimistic V1', 'Pessimistic V1'])
    )
  }
}

const NetworkDebugOptions = FormComponent.compose(
  NetworkDebugOptionsClass
);

export default NetworkDebugOptions;