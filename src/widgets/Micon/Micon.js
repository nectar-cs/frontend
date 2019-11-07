import React from "react";
import S from './MiconStyles'
import PropTypes from 'prop-types'

export default function Micon(props){
  return(
    <S.Micon
      onClick={props.callback}
      className='material-icons'
      extras={props.e}
      {...props}>
      { props.n }
    </S.Micon>
  )
}

Micon.propTypes = {
  n: PropTypes.string.isRequired,
  e: PropTypes.any,
  size: PropTypes.string,
  rotate: PropTypes.number,
  callback: PropTypes.func,
  emotion: PropTypes.string
};

Micon.defaultProps = {
  e: {}
};