import moment from 'moment';
import React, { Fragment } from 'react';
import { Types } from '../../types/CommonTypes';
import Utils from '../../utils/Utils';
import TextOverLineSubtitle from '../../widgets/TextOverLineSubtitle/TextOverLineSubtitle';
import Img from './../../assets/img-combos';
import Text from './../../assets/text-combos';
import S from './CommitInfoStyles';
import defaults from './defaults';
import FileChange from './FileChange';

export default class CommitInfo extends React.Component {
  render() {
    return (
      <Fragment>
        <TextOverLineSubtitle text="Metadata" />
        {this.renderAuthorInfo()}
        {this.renderCommitMessage()}
        {this.renderFullSha()}
        <TextOverLineSubtitle text="Changes" />
        {this.renderTable()}
      </Fragment>
    );
  }

  componentDidMount() {
    Utils.mp('Last Commit Start', { bound: true });
  }

  renderAuthorInfo() {
    // eslint-disable-next-line prefer-const
    let { author, authorAvatar, authorUrl } = this.props.commit;
    const { url, sha, timestamp } = this.props.commit;
    authorAvatar = authorAvatar || defaults.defaultGitAvatar;

    return (
      <S.AuthorLine>
        <Img.RoundedForRow src={authorAvatar} push={true} />
        <a href={authorUrl} target="_blank" rel="noopener noreferrer">
          <Text.BoldRef push={true}>{author}</Text.BoldRef>
        </a>
        <p>committed</p>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Text.BoldRef pushed={true} push={true}>
            {sha.substring(0, 7)}
          </Text.BoldRef>
        </a>
        <p>to branch</p>
        <Text.BoldRef pushed={true} push={true}>
          ?
        </Text.BoldRef>
        <p>{moment(timestamp).fromNow()}</p>
      </S.AuthorLine>
    );
  }

  renderCommitMessage() {
    const { message } = this.props.commit;
    return (
      <S.Line>
        <p>
          Message: <i>"{message}"</i>
        </p>
      </S.Line>
    );
  }

  renderFullSha() {
    const { sha } = this.props.commit;
    return (
      <S.Line>
        <p>Full SHA1: {sha}</p>
      </S.Line>
    );
  }

  renderTable() {
    return (
      <S.ChangesTable>
        <tbody>{this.renderFileChanges()}</tbody>
      </S.ChangesTable>
    );
  }

  renderFileChanges() {
    const { changes } = this.props.commit;
    return changes.map(change => <FileChange change={change} />);
  }

  static propTypes = {
    commit: Types.DetailedCommit,
  };
}
