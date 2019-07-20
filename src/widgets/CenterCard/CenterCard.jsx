
import React from 'react'
import s from './CenterCard.sass'

export default function CenterCard(props){
  return(
    <div className={s.centerCard}>
      { props.children }
    </div>
  )
}