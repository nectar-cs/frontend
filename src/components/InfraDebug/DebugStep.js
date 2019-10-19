import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import defaults from './defaults'
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import Text from "../../assets/text-combos";

export default class DebugStep extends React.Component {

  render(){
    return(
      <Fragment>
        { this.renderHeader() }
        { this.renderNotReady() }
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

  renderNotReady(){
    if(this.props.isConfigDone) return null;

    return(
      <CenterAnnouncement
        iconName='pause_circle_outline'
        contentType='children'>
        <Text.P>{defaults.debuggers.notReady}</Text.P>
      </CenterAnnouncement>
    )
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired

  }
}