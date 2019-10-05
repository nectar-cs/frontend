import React from 'react'
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light";
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeViewer(props){
  return(
    <SyntaxHighlighter language="bash" style={dark} >
      { "kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq " }
    </SyntaxHighlighter>
  )
}