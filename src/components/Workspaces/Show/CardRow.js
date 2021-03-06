import React from "react";
import PropTypes from 'prop-types'
import { S } from './CardRowStyles'

export default function CardRow(props) {
  const { label, text, material, callback } = props;
  return(
    <tr>
      <td><S.RowText>{label}</S.RowText></td>
      <td>
        <S.Container>
          <S.RowText onClick={callback} clickable={true}>
            { text }
          </S.RowText>
          <S.Icon className='material-icons'>{material}</S.Icon>
        </S.Container>
      </td>
    </tr>
  )
}

//{ material && <i className='material-icons'>{material}</i> }

CardRow.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  getDeployment: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  material: PropTypes.string
};
