import React, {Fragment} from 'react'
import S from './CommitInfoStyles'
import {Types} from "../../types/Deployment";
import Text from './../../assets/text-combos'
import Img from './../../assets/img-combos'
import FileChange from "./FileChange";
import moment from "moment";
import defaults from "./defaults";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";

export default class CommitInfo extends React.Component{

  render(){
    return(
      <Fragment>
        <TextOverLineSubtitle text='Metadata'/>
        { this.renderAuthorInfo() }
        { this.renderCommitMessage() }
        <TextOverLineSubtitle text='Changes'/>
        { this.renderTable() }
      </Fragment>
    )
  }

  renderAuthorInfo(){
    let { author, authorAvatar, authorUrl } = this.props.commit;
    const { url, sha, timestamp } = this.props.commit;
    authorAvatar = authorAvatar || defaults.defaultGitAvatar;

    return(
      <S.AuthorLine>
        <Img.RoundedForRow src={authorAvatar} push={true}/>
        <a href={authorUrl}>
          <Text.BoldRef push={true}>{author}</Text.BoldRef>
        </a>
        <p>committed</p>
        <a href={url}>
          <Text.BoldRef pushed={true} push={true}>{sha.substring(0, 7)}</Text.BoldRef>
        </a>
        <p>to branch</p>
        <Text.BoldRef pushed={true} push={true}>?</Text.BoldRef>
        <p>{moment(timestamp).fromNow()}</p>
      </S.AuthorLine>
    )
  }

  renderCommitMessage(){
    const { message } = this.props.commit;
    return(
      <S.Line>
        <p>Message: <i>"{message}"</i></p>
      </S.Line>
    )
  }

  renderTable(){
    return(
      <S.ChangesTable>
        <tbody>
        { this.renderFileChanges() }
        </tbody>
      </S.ChangesTable>
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