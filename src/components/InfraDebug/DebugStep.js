import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import defaults from './defaults'

export default class DebugStep extends React.Component {

  render(){
    return(
      <Fragment>
        { this.renderHeader() }
      </Fragment>
    )
  }

  renderHeader(){
    const { node } = this.props;
    return(
      <LeftHeader
        graphicName='bug_report'
        title={defaults.step.title(node.depth() + 1, node.title())}
        subtitle={defaults.step.subtitle}
        graphicType='icon'
      />
    )
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired
  }
}