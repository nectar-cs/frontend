import React from 'react'
import PropTypes from 'prop-types'
import s from './HttpActionsModal.sass'
import {LeftHeader} from "../../widgets/LeftHeader/LeftHeader";
import {FULL_DEPLOYMENT} from "../../types/Deployment";
import MiscUtils from "../../utils/MiscUtils";
import {RightHeader} from "../../widgets/RightHeader/RightHeader";

export default class HttpActionsModal extends React.Component {

  renderLeftHeader(){
    return(
      <LeftHeader
       graphicName={MiscUtils.frameworkImage('docker')}
       title={this.props.deployment.name}
       subtitle={'Not connected to Git'}
      />
    );
  }

  renderRightHeader(){
    return(
      <RightHeader
        title='HTTP Debugging'
        subtitle={'Test real requests'}
        graphicType='icon'
        graphicName='perm_data_setting'
      />
    );
  }

  render(){
    return(
      <div className={s.modal}>
        { this.renderLeftHeader() }
        { this.renderRightHeader() }

      </div>
    )
  }

  static propTypes = {
    ...FULL_DEPLOYMENT
  }

}