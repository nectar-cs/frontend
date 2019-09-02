import React from 'react'
import PropTypes from 'prop-types'
import MiscUtils from "../../utils/MiscUtils";
import s from './Response.sass'

export class BodyResponseView extends React.Component {

  render() {
    if(MiscUtils.isJson(this.props.body)){
      const hash = JSON.parse(this.props.body);
      return(
        <div className={s.holder}>
          <code className={`${s.code} language-json`}>
            { JSON.stringify(hash, null, 2) }
          </code>
        </div>
      )
    } else return <code>{this.props.body}</code>;
  }

  static propTypes = {
    body: PropTypes.string.isRequired
  }
}

export class HeadersResponseView extends React.Component {
  render() {
    return (
      <div className={s.holder}>
        <code className={"language-markup"}>
          { (this.props.headers || []).join("\n") }
        </code>
      </div>
    )
  }
}

export class RawResponseView extends React.Component {
  render() {
    return (
      <div className={s.holder}>
        <code>
          { this.props.raw }
        </code>
      </div>
    )
  }
}
