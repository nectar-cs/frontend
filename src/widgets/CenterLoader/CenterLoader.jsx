import React from 'react';
import PropTypes from 'prop-types';
import s from './CenterLoader.sass';

export default function CenterLoader(props) {
  if (props.contrast) return <div className={s.contrastLoader} />;
  else return <div className={s.loader} />;
}

CenterLoader.propTypes = {
  contrast: PropTypes.bool,
};

CenterLoader.defaultProps = {
  contrast: false,
};
