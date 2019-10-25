import React, {Fragment} from "react";

const defaults = {
  header: {
    title: "Manual Stunt Pod Culling",
    subtitle: "To avoid polluting your cluster"
  },

  explanation: {
    title: "WTF is this?",
    lines: [
      <Fragment>
        <b>Mosaic</b> creates temporary pods in specific
        namespaces to carry out work like HTTP operations
        and network debugging. We call these <b>Stunt Pods</b>.
      </Fragment>,

      <Fragment>
        <b>But</b>, because this is still an early alpha, the logic
        for killing them intelligently <b>has not been implemented yet</b>.
      </Fragment>,

      <Fragment>
        <b>So for now</b>, this popup lets you kill them easily. It sucks
        but it beats doing it wrong in the background and messing things up.
      </Fragment>
    ]
  },

  list: {
    title: "List",
    button: "Delete All"
  }
};

export default defaults;