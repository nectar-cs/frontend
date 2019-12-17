import React from 'react'
import * as Styles from "./ConclusionStyles";
import {Text} from "ui-common/api/styles";

export default function Conclusion ({success, reason}) {
  const emotion = success ? 'success' : 'failure';
  const text = success ? 'Success' : 'Failure';
  return(
    <Styles.Container>
      <Styles.LineOne>
        <Text.BoldStatus emotion={emotion}>{text}.</Text.BoldStatus>
        <Styles.Reason>{reason}</Styles.Reason>
      </Styles.LineOne>
    </Styles.Container>
  );
}