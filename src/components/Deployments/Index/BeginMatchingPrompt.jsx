import React from 'react'
import s from './BeginMatchingPrompt.sass'

export default function BeginMatchingPrompt(){
  return(
    <div>
      <h2 className={s.title}>Start Here</h2>
      <div className={s.image}/>
      <p className={s.explanation}>An Explanation</p>
      <button className={s.okButton}>Begin Matching</button>
    </div>
  )
}