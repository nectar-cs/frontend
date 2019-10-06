import React, {Fragment} from 'react'
import {Types} from "../../types/Deployment";
import FileChange from "./FileChange";

export default class CommitInfo extends React.Component{

  render(){
    return(
      <Fragment>
        <h4>Commit information</h4>
        { this.renderTable() }
      </Fragment>
    )
  }

  renderTable(){
    return(
      <table>
        <tbody>
        { this.renderFileChanges() }
        </tbody>
      </table>
    )
  }

  renderFileChanges(){
    const { changes } = this.props.commit;
    return changes.map(change =>
      <FileChange change={change}/>
    );
  }

  static PropTypes = {
    commit: Types.DetailedCommit
  }
}