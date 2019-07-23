import React from 'react'
import s from './BeginMatchingPrompt.sass'
import {Redirect} from "react-router";
import {ROUTES} from "../../../containers/RoutesConsts";

export default class BeginMatchingPrompt extends React.Component {

  constructor(props){
    super(props);
    this.state = { isRedirecting: false };
    this.setRedirecting = this.setRedirecting.bind(this);
  }

  render(){
    if(this.state.isRedirecting)
      return BeginMatchingPrompt.renderRedirecting();
    else return this.renderMainContent();
  }

  setRedirecting(){
    this.setState((s) => ({...s, isRedirecting: true}));
  }

  renderMainContent(){
    return(
      <div>
        <h2 className={s.title}>Start Here</h2>
        <div className={s.image}/>
        <p className={s.explanation}>An Explanation</p>
        <button onClick={this.setRedirecting} className={s.okButton}>Begin Matching</button>
      </div>
    )
  }

  static renderRedirecting(){
    return <Redirect to={ROUTES.deployments.detect.path}/>
  }

}