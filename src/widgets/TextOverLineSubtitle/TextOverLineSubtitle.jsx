import React from 'react';
import S from './Styles';

export default function TextOverLineSubtitle(props: Props) {
  const toggleThere = props.toggleOpen != null;
  const toggleOrient = props.toggleOpen ? 'up' : 'down';
  const toggleOrientName = `keyboard_arrow_${toggleOrient}`;

  return (
    <S.HorizontalBoxWrapper>
      <S.HorizontalLine />
      <S.Title>{props.text}</S.Title>
      <S.Toggle onClick={props.callback} there={toggleThere} className="material-icons">
        {toggleOrientName}
      </S.Toggle>
    </S.HorizontalBoxWrapper>
  );
}

type Props = {
  text: string,
  toggleOpen: ?string,
  callback: ?(() => *),
};
