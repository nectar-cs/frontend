//@flow
import React from 'react'
import {makeRoute, ROUTES} from "../../Root/RoutesConsts";
import {Link} from "react-router-dom";
import {Layout, Text} from "@nectar/js-common";
import ColoredLabelList from "../../../widgets/ColoredLabelList/ColoredLabelList";
import type {Workspace} from "../../../types/Types";

export function WorkspaceHeader() {
  return(
    <tr>
      <th><p>Workspace</p></th>
      <th><p>Default?</p></th>
      <th><p>Namespace Filters</p></th>
      <th><p>Label Filters</p></th>
      <th><p>Actions</p></th>
    </tr>
  )
}

function TdWrap({children}){
  const TdArray = () => children.map((child, i) => (
    <td key={i}>{child}</td>
  ));
  return <tr><TdArray/></tr>
}

export function WorkspaceRow(props: Props) {
  const bundle = ROUTES.workspaces;

  const { workspace, deleteCallback } = props;
  const { id, name, isDefault, nsFilters, lbFilters } = workspace;
  const { nsFilterType, lbFilterType } = workspace;

  const showPath = makeRoute(bundle.show.path, {id});
  const editPath = makeRoute(bundle.edit.path, {id});

  return(
    <TdWrap>
      <Link to={showPath}><p>{name}</p></Link>
      <Text.BoldStatus>{isDefault.toString()}</Text.BoldStatus>
      <ColoredLabelList labelType={nsFilterType} labels={nsFilters}/>
      <ColoredLabelList labelType={lbFilterType} labels={lbFilters}/>
      <Layout.TextLine>
        <Link to={editPath}><p>Edit</p></Link>
        <p>&nbsp;&nbsp;</p>
        <a><p onClick={() => deleteCallback(id)}>Delete</p></a>
      </Layout.TextLine>
    </TdWrap>
  )
}

type Props = {
  workspace: Workspace,
  deleteCallback: number => void
};
