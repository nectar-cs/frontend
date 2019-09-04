import React from 'react'
import s from './TextOverLineSubtitle.sass'

export default function TextOverLineSubtitle(props) {
  return(
    <div className={s.horizonBoxWrapper}>
      <div className={s.horizontalLine}/>
      <p className={s.title}>{props.text}</p>
    </div>
  )
}