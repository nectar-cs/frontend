import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import defaults from './defaults'
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import Text from "../../assets/text-combos";
import StepExecution from "./StepExecution";

export default class DebugStep extends React.Component {

  componentDidMount(){

  }

  render(){
    return(
      <Fragment>
        { this.renderHeader() }
        { this.renderNotReady() }
        { this.renderExecution() }
      </Fragment>
    )
  }

  renderHeader(){
    const { node, isConfigDone } = this.props;
    if(!isConfigDone) return null;

    return(
      <LeftHeader
        graphicName='bug_report'
        title={defaults.step.title(node.depth() + 1, node.title())}
        subtitle={defaults.step.subtitle}
        graphicType='icon'
      />
    )
  }

  renderExecution(){
    const { node, isConfigDone } = this.props;
    if(!isConfigDone) return null;

    return(
      <StepExecution
        nextStepCallback={null}
        node={node}
      />
    )
  }

  renderNotReady(){
    if(this.props.isConfigDone) return null;

    return(
      <CenterAnnouncement
        iconName='pause_circle_outline'
        contentType='children'>
        <Text.P>{defaults.step.notReady}</Text.P>
      </CenterAnnouncement>
    )
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired

  }
}