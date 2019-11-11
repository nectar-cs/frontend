import Text from "../../assets/text-combos";
import type {RevisionStatus} from "../../types/Types";
import React from "react";

function AppRow(props: RowProps){
  const { isChecked, status, callback } = props;

  const emo = (which) => status.updateNecessary ?
    (which ? 'failure' : 'warnSoft') : 'success';
  const fmt = (which) => (which || 'N/A').substring(0, 7);
  const line = (which) => (
    <Text.BoldStatus raw emotion={emo(which)}>
      { fmt(which) }
    </Text.BoldStatus>
  );

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