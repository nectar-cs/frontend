import React from 'react'
import PropTypes from 'prop-types'
import Utils from "../../utils/Utils";
import s from './Response.sass'

export class BodyResponseView extends React.Component {

  render() {
    if(Utils.isJson(this.props.body)){
      const hash = JSON.parse(this.props.body);
      return(
        <div className={s.holder}>
          <code className={`${s.code} language-json`}>
            { JSON.stringify(hash, null, 2) }
          </code>
        </div>
      )
    } else {
      return(
        <iframe className={s.holder} srcDoc={this.props.body}/>
      )
    }
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
