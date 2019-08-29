import React, {Fragment} from "react";
import s from './DestinationPane.sass'

export default class DestinationPane extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    return(
      <Fragment>
        <div className={s.inputLine}>
          <p className={s.label}>Target Host</p>
          <select className={s.fullLineInput}/>
        </div>
        <div className={s.inputLine}>
          <p className={s.label}>Path and Verb</p>
          <input className={s.pathInput}/>
          <select className={s.verbSelect}/>
        </div>
      </Fragment>
    )
  }
}