import React, {Fragment} from 'react'
import Text from './../../../assets/text-combos'

const defaults = {
  intro: (
    <Fragment>
      <Text.P raw>It's important to understand that in Kubernetes,
        there is <i>no direct relationship</i> between Deployments and
        Services.
      </Text.P>

      <Text.P>Services route traffic directly to pods. Deployments
        manage pods. So it's often sensible to think about "a deployment's services".
      </Text.P>

      <Text.P>A "deployment's services", is <b>the set of services
        that label-selects that deployment's pods:</b>
      </Text.P>

    </Fragment>
  )
};

export default defaults;