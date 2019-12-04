import React from 'react';
import PropTypes from 'prop-types';
import s from './CenterCard.sass';

export default function CenterCard(props) {
  const style = props.size === 'normal' ? s.centerCard : s.centerCardLarge;

  return <div className={style}>{props.children}</div>;
}

CenterCard.propTypes = {
  size: PropTypes.oneOf(['normal', 'large']),
};

CenterCard.defaultProps = {
  size: 'normal',
};
