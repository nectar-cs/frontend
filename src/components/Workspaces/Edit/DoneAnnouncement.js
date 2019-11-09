import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";
import ls from "../../../assets/content-layouts.sass";
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";
import React from "react";


export default function  DoneAnnouncement({name, id}){

  const bundle = ROUTES.workspaces;
  const editPath = makeRoute(bundle.edit.path, { id });
  const continuePath = makeRoute(bundle.show.path, { id });

  return(
    <div className={ls.fullScreen}>
      <CenterAnnouncement
        contentType='children'
        action={bundle.index.path}
        iconName='done_all'>
        <p>
          {name} saved.
          <a href={editPath}>Keep editing</a>, or,
          <a href={continuePath}>continue</a>.
        </p>
      </CenterAnnouncement>
    </div>
  )

}