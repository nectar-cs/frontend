import React, {Fragment} from "react";
import {S} from "./ImageFormStyles";

export const defaults ={
  copy: {
    header: 'Do things to the images or pods for this deployment',
    intro: {
      preSubmit: "You can set a new image or force " +
        " apply one with the same name.",
      postSubmit: "All pods are being restarted. The operation " +
        "will be done once the following are true: "
    }
    ,
    warningOne: (
      <Fragment>
        <b>Important.</b> If anything goes wrong, or if your image fails,
        your app may go offline.
      </Fragment>
    ),
    risks: (
      <ul>
        <li><p>asdsa</p></li>
      </ul>
    ),
    dockerNotSet: "Deployment not bound to Docker."
  },

  els: {
    blockedConn: (action, thing) => (
      <Fragment>
        Make sure you <a onClick={action}>connect</a> to {thing}.
      </Fragment>
    ),
    blockedBind: (path, thing) => (
      <Fragment>
        And that you <a href={path}>bind</a> this deployment to a {thing}.
      </Fragment>
    ),
    blockedIcon: "sentiment_very_dissatisfied"
  }
};