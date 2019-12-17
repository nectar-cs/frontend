import {Text} from "ui-common/api/styles";
import type {RevisionStatus} from "../../types/Types";
import React from "react";

const P = Text.BoldStatus;

function AppRow(props: RowProps){
  const { isChecked, status, callback } = props;
  const hot = status.updateNecessary;
  const emo = which => which ? (hot ? 'failure' : 'success') : 'warn';
  const fmt = which => (which || 'N/A').substring(0, 7);
  const line = which => <P raw emotion={emo(which)}>{ fmt(which) }</P>;

  return(
    <tr>
      <td><input type='checkbox' checked={isChecked} onChange={callback}/></td>
      <td><p>{status.appName}</p></td>
      <td> {line(status.currentRevision)} </td>
      <td> {line(status.latestRevision)} </td>
    </tr>
  )
}

type RowProps = {
  status: RevisionStatus,
  isChecked: boolean,
  callback: (string) => void
};

function HeaderRow() {
  return(
    <tr>
      <th><p>Update</p></th>
      <th><p>App</p></th>
      <th><p>Current V</p></th>
      <th><p>Available V</p></th>
    </tr>
  )
}

const Table = {
  AppRow,
  HeaderRow
};

export default Table;