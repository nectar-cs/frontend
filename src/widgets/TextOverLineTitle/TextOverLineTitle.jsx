import React from 'react';
import s from './TextOverLineTitle.sass';

export default function TextOverLineTitle(props) {
  return (
    <div className={s.horizonBoxWrapper}>
      <div className={s.horizontalLine} />
      <h3 className={s.title}>{props.text}</h3>
    </div>
  );
}
