import React from 'react'
import ts from './../../assets/text-combos.sass'
import PropTypes from 'prop-types'

export default function ColoredLabelList(props) {
  const isWhiteList = props.labelType === 'whitelist';
  const labelClass = isWhiteList ? ts.whiteLabel : ts.blackLabel;

  return props.labels.map((labelCopy) => (
    <p className={labelClass}>{labelCopy}</p>
  ));
}

ColoredLabelList.propTypes = {
  labelType: PropTypes.oneOf(['whitelist', 'blacklist']).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired
};