import React from "react";
import S from './MiconStyles'
import PropTypes from 'prop-types'

export default function Micon(props){
  return(
    <S.Micon className='material-icons' extras={props.e}>
      { props.n }
    </S.Micon>
  )
}

Micon.propTypes = {
  n: PropTypes.string.isRequired,
  e: PropTypes.object
};

Micon.defaultProps = {
  e: {}
};
