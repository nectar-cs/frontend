import React, {Fragment} from 'react'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import defaults from "./defaults";
import {Types} from "../../types/Deployment";

export default class OverviewSide extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  render(){
    return(
      <Fragment>
        { this.renderHeader() }
      </Fragment>
    )
  }

  renderHeader(){
    const { deployment, matching } = this.props;
    return(
      <LeftHeader
        graphicName={MiscUtils.msImage(deployment, matching)}
        title={this.config().header.title(deployment.name)}
        subtitle={this.config().header.subtitle}
      />
    )
  }

  config(){ return defaults.debuggers[this.type()]; }
  type() { return this.props.type; }

  static propTypes = {
    deployment: Types.Deployment,
    matching: Types.Matching,
  }
}