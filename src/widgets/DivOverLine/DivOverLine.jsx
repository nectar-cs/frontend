// @flow
import React from 'react'
import s from './DivOverLine.sass'

export default function DivOverLine(props) {
  return(
    <div className={s.divOverLine}>
      <div className={s.line}/>
      <div className={s.eclipse}>
        <div className={s.eclipsedContainer}>
          { props.children }
        </div>
      </div>
    </div>
  )
}