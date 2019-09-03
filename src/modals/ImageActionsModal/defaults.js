import React, {Fragment} from "react";

export const defaults ={
  copy: {
    warningOne: (
      <Fragment>
        <b>Important.</b> If anything goes wrong, or your image fails,
        your deployment will be left offline.
      </Fragment>
    ),
    risks: (
      <ul>
        <li><p>asdsa</p></li>
      </ul>
    )
  }
};