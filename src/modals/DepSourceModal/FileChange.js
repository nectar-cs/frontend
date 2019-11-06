import React from 'react'
import Text from './../../assets/text-combos'
import {Types} from "../../types/CommonTypes";

export default class FileChange extends React.Component{

  render(){
    return(
      <tr>
        <td>{this.renderFileName()}</td>
        <td>{this.renderStatus()}</td>
        <td>{this.renderStats()}</td>
      </tr>
    )
  }

  renderStatus(){
    const { change } = this.props;
    const emotion = FileChange.colorMap(change.status);
    return(
      <Text.BoldStatus emotion={emotion}>
        { change.status.toUpperCase() }
      </Text.BoldStatus>
    )
  }

  renderFileName(){
    const { change } = this.props;
    return(
      <a href={change.blobUrl} target='_blank'>
        <code>{change.filename}</code>
      </a>
    )
  }

  renderStats(){
    const { additions, deletions } = this.props.change;
    return <p>{`+${additions} / -${deletions}`}</p>;
  }

  static propTypes = {
    change: Types.CommitChange
  };

  static colorMap(status){
    status = status.toLowerCase();
    if(status === 'modified') return "warnSoft";
    if(status === 'deleted') return "fail";
    if(status === "created") return "success";
    if(status === "added") return "success";
  }

}