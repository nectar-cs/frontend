import React from 'react'
import s from './KubeErrorModal.sass'
import LeftHeader, {ICON as TYPE_ICON } from "../LeftHeader/LeftHeader";
import ModalButton from "../Buttons/ModalButton";
import {Redirect} from "react-router";
import {ROUTES} from "../../containers/RoutesConsts";

export default class AuthErrorModal extends React.Component{
  constructor(props){
    super(props);
    this.state = { isRedirecting: false };
    this.submitRetry = this.submitRetry.bind(this);
  }

  render(){
    if (this.state.isRedirecting)
      return <Redirect to={ROUTES.auth.login.path}/>;

    return(
      <div className={s.modal}>
        <LeftHeader
          title={"Authentication Error"}
          subtitle={"Invalid or expired auth token"}
          graphicType={TYPE_ICON}
          graphicName={'person'}
        />
        <p>You logged out</p>
        <ModalButton
          title={'Login again'}
          callback={this.submitRetry}
          isEnabled={!this.state.isRedirecting}
        />
      </div>
    );
  }

  submitRetry(){
    this.setState(s => ({...s, isRedirecting: true}));
  }

  bundle(){
    return this.state.bundle || this.props.bundle;
  }
}
