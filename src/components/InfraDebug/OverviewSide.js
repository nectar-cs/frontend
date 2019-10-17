import React, {Fragment} from 'react'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import defaults from "./defaults";
import {Types} from "../../types/Deployment";
import Tree from 'react-d3-tree';
import DecisionTree from "./DecisionTree";



export default class OverviewSide extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount(){
  }

  render(){
    return(
      <Fragment>
        { this.renderHeader() }
        { this.renderTree() }
      </Fragment>
    )
  }

  renderTree(){
    return <DecisionTree/>
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