import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import MiscUtils from "../../utils/MiscUtils";

export class BodyResponseView extends React.Component {

  render() {
    if(MiscUtils.isJson(this.props.body)){
      const hash = JSON.parse(this.props.body);
      return(
      <pre>
        <code className={"language-json"}>
          { JSON.stringify(hash, null, 2) }
        </code>
      </pre>
      )
    } else return <code>{ this.props.body }</code>;
  }

  static propTypes = {
    body: PropTypes.string.isRequired
  }
}

export class HeadersResponseView extends React.Component {
  render() {
    return (
      <pre>
        <code className={"language-markup"}>
          { this.props.headers.join("\n") }
        </code>
      </pre>
    )
  }
}

export class RawResponseView extends React.Component {
  render() {
    return (
      <code>
        { this.props.response.headers.join("\n") }
        <br/><br/>
        { this.props.response.body }
      </code>
    )
  }
}
