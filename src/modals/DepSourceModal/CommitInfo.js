import React, {Fragment} from 'react'
import {Types} from "../../types/Deployment";

export default class CommitInfo extends React.Component{

  render(){
    return(
      <Fragment>
        <h4>Commit information</h4>
      </Fragment>
    )
  }

  static PropTypes = {
    deployment: Types.Deployment,
    matching: Types.Matching,
  }
}