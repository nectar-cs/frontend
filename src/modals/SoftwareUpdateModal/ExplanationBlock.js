import React, {Fragment} from 'react'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import {Text} from "ui-common";

export default function ExplanationBlock(){
  return(
    <Fragment>
      <TextOverLineSubtitle text="What's going on?"/>
      <Text.P><b>Mosaic</b>, which is running in your cluster, needs to update
        one or more of the images inside its deployments.
      </Text.P>
      <Text.P low={2}><b>What will happen</b> is Nectar will kill its own pods so that
        they can be restarted with the new image.
      </Text.P>
      <Text.P low={2}><b>This means</b> the app will stop working for ~15 seconds.
        I.e:
      </Text.P>
    </Fragment>
  )


}