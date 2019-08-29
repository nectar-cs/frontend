import React, {Fragment} from "react";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import RightHeader from "../../widgets/RightHeader/RightHeader";

export default function LeftRightHeaders(props) {
  return(
    <Fragment>
      <LeftHeader
        graphicName={MiscUtils.frameworkImage('docker')}
        title={props.name}
        subtitle={'Not connected to Git'}
      />
      <RightHeader
        title='HTTP Debugging'
        subtitle={'Test real requests'}
        graphicType='icon'
        graphicName='perm_data_setting'
      />
    </Fragment>
  )
}