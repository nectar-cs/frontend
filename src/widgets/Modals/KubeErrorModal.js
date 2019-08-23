import React from 'react'
import s from './KubeErrorModal.sass'

export default class KubeErrorModal extends React.Component{
  render(){
    console.log("RENDER");
    return(
      <div className={s.content}>
        <p>Hey</p>
      </div>
    )
  }

}
