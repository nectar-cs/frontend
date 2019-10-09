import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import S from "./PreviewStyles";
import Text from './../../assets/text-combos'

function Pending(props){
  if(props.isExecuting) return <Text.Code>...</Text.Code>;
  else return null;
}

function Output(props){
  if(props.output) return <Text.Code>{props.output}</Text.Code>;
  else return null;
}

export default function Preview(props){
  return(
    <S.Preview>
      <Text.Code>{props.command}</Text.Code>
      <Pending {...props}/>
      <Output {...props}/>
    </S.Preview>
  )
}

Preview.propTypes = {
  command: PropTypes.string.isRequired,
  output: PropTypes.string,
  isExecuting: PropTypes.bool.isRequired
};