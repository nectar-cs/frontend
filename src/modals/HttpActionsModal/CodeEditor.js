import React from 'react'
import PropTypes from 'prop-types'
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';


export default class CodeEditor extends React.Component {

  constructor(props){
    super(props);
    this.state = {code: `console.log();`};
  }

  render(){
    return(
      <Editor
        value={this.props.body}
        onValueChange={s => this.props.onCodeChanged(s)}
        highlight={code => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          height: "280px",
          width: "100%",
          borderColor: "#233142",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "2px"
        }}
      />
    )
  }

  static propTypes = {
    onCodeChanged: PropTypes.func.isRequired
  }
}