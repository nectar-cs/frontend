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
  ),

  pseudoQuery: (ns, lbs) =>
    `svc where ns=${ns} AND selector SUBSET OF [${lbs}] `,

  effectsWarning: <Fragment>Note that the effects of <b>Network
    Policies and Ingresses</b> are not taken into account
    in this picture. Coming soon :p</Fragment>,

  noEndpoints: "K8s wasn't able to figure out where this service" +
    " should forward traffic to. This is most likely a label drama. " +
    " Run 'Debugging and Troubleshooting on the right'"
};

export default defaults;