import React from 'react'
import PropTypes from 'prop-types'
import Utils from "../../utils/Utils";
import S from './ResponseStyles'

export class BodyResponseView extends React.Component {

  render() {
    if(Utils.isJson(this.props.body)){
      const hash = JSON.parse(this.props.body);
      return(
        <S.Holder>
          <S.Code className='language-json'>
            { JSON.stringify(hash, null, 2) }
          </S.Code>
        </S.Holder>
      )
    } else {
      return(
        <S.IHolder srcDoc={this.props.body}/>
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
      <S.Holder>
        <code className={"language-markup"}>
          { (this.props.headers || []).join("\n") }
        </code>
      </S.Holder>
    )
  }
}

export class RawResponseView extends React.Component {
  render() {
    return (
      <S.Holder>
        <code>
          { this.props.raw }
        </code>
      </S.Holder>
    )
  }
}
