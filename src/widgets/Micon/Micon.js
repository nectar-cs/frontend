import React from "react";
import S from './MiconStyles'
import PropTypes from 'prop-types'

export default function Micon(props){
  return(
    <S.Micon
      onClick={props.callback}
      className='material-icons'
      size={props.size}
      extras={props.e}
      rotate={props.rotate}>
      { props.n }
    </S.Micon>
  )
}

Micon.propTypes = {
  n: PropTypes.string.isRequired,
  e: PropTypes.object,
  size: PropTypes.string,
  rotate: PropTypes.number,
  callback: PropTypes.func
};

Micon.defaultProps = {
  e: {}
};
