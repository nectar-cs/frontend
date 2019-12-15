
import React from 'react'
import PropTypes from 'prop-types'
import S from './CenterCardStyles'

export default function CenterCard(props){
  return(
    <S.Container size={props.size}>
      { props.children }
    </S.Container>
  );
}

CenterCard.propTypes = {
  size: PropTypes.oneOf(['normal', 'large'])
};

CenterCard.defaultProps = {
  size: 'normal'
};
