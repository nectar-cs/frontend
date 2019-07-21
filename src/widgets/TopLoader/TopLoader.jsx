import s from './TopLoader.sass';
import React from 'react';

export default function TopLoader(props){

  return (
    <div
      style={{visibility: props.isFetching ? 'visible' : 'hidden'}}
      className={s.topLoader}
    />
  )
}
