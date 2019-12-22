import React from "react";
import {makeRoute, ROUTES} from "../../Root/RoutesConsts";
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";
import {Layout, Text} from "@nectar/js-common";


export default function  DoneAnnouncement({name, id}){

  const bundle = ROUTES.workspaces;
  const editPath = makeRoute(bundle.edit.path, { id });
  const continuePath = makeRoute(bundle.show.path, { id });
  return(
    <Layout.FullWidthPanel>
      <CenterAnnouncement
        contentType='children'
        action={bundle.index.path}
        iconName='done_all'>
        <Text.P low={2}>
          {name} saved.
          <a href={editPath}>Keep editing</a>, or,
          <a href={continuePath}>continue</a>.
        </Text.P>
      </CenterAnnouncement>
    </Layout.FullWidthPanel>
  )
}
