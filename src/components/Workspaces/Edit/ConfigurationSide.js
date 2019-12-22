import React, {Fragment} from 'react'
import type {Workspace} from "../../../types/Types";
import WorkspaceForm from "./WorkspaceForm";
import { LeftHeader, Loader, TextOverLineSubtitle } from "@nectar/js-common";

export default function ConfigurationSide(props: Props) {
  return(
    <Fragment>
      <Loader.TopRightSpinner there={props.isFetching}/>
      <LeftHeader
        title={props.workspace.name || "My New Workspace"}
        subtitle='Which deployments should go in this workspace?'
        graphicType='icon'
        graphicName='developer_board'
      />
      <TextOverLineSubtitle text='Setup'/>
      <WorkspaceForm
        {...props.workspace}
        namespaceChoices={props.namespaces}
        labelChoices={props.labels}
        notifyFormValueChanged={props.callback}
      />
    </Fragment>
  )
}

type Props = {
  workspace: Workspace,
  isFetching: boolean,
  namespaces: string[],
  labels: [],
  callback: (*) => (*)
}
