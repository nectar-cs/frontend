import { makeRoute, ROUTES } from '../../../containers/RoutesConsts';
import ls from '../../../assets/content-layouts.sass';
import CenterAnnouncement from '../../../widgets/CenterAnnouncement/CenterAnnouncement';
import React from 'react';
import Text from '../../../assets/text-combos';

export default function DoneAnnouncement({ name, id }) {
  const bundle = ROUTES.workspaces;
  const editPath = makeRoute(bundle.edit.path, { id });
  const continuePath = makeRoute(bundle.show.path, { id });

  return (
    <div className={ls.fullScreen}>
      <CenterAnnouncement contentType="children" action={bundle.index.path} iconName="done_all">
        <Text.P low={2}>
          {name} saved.
          <a href={editPath}>Keep editing</a>, or,
          <a href={continuePath}>continue</a>.
        </Text.P>
      </CenterAnnouncement>
    </div>
  );
}
