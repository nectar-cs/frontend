import React, {Fragment, useEffect, useRef} from 'react'
import { Layout, Text, TextOverLineSubtitle } from "@nectar/js-common";

export default function TermSection({title, lines, extras = {}}){

  const lineEndRef = useRef(null);

  const scrollToBottom = () => {
    lineEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom);

  const Lines = () => lines.map((cmd, i) => (
    <Text.Code key={i} chill>{cmd}</Text.Code>
  ));

  return(
    <Fragment>
      <TextOverLineSubtitle text={title}/>
      <Layout.BigCodeViewer {...extras}>
        <Lines/>
        <div ref={lineEndRef} />
      </Layout.BigCodeViewer>
    </Fragment>
  )
}
