import React from 'react';
import PropTypes from 'prop-types';
import { S } from './AddNewStyles';

export default function AddNew(props) {
  return (
    <S.Layout onClick={props.action}>
      <S.Icon className="material-icons">add_circle_outline</S.Icon>
      {props.children}
    </S.Layout>
  );
}

AddNew.propTypes = {
  action: PropTypes.any.isRequired,
};
