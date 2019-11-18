import React, {Fragment} from 'react';
import Utils from "../../utils/Utils";
import {Redirect} from "react-router";
import Backend from "../../utils/Backend";
import Layout from "../../assets/layouts";
import S from './Styles';
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import AuthForm from "./AuthForm";
import MainLayout from "./MainLayout";
import Button from "../../assets/buttons";

const humanizeString = require('humanize-string');

export default class LoginAndRegister extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      errors: [],
      isLoading: false,
      ...LoginAndRegister.defaultCredentials()
    };
    this.submit = this.submit.bind(this);
    this.update = this.update.bind(this);
    this.onAuthSuccess = this.onAuthSuccess.bind(this);
    this.onAuthFailure = this.onAuthFailure.bind(this);
  }

  render(){
    return(
      <Fragment>
        { this.renderAuthenticated() }
        { this.renderLoading() }
        { this.renderMainContent() }
      </Fragment>
    )
  }

  renderMainContent(){
    const { authenticated, isLoading, errors } = this.state;
    if(authenticated || isLoading) return null;

    return(
      <MainLayout errors={errors} type={this.authType()}>
        <S.FormBox>
          { this.renderForm() }
          { this.renderSubmitButton() }
        </S.FormBox>
      </MainLayout>
    )
  }

  renderForm(){
    const { email, password, confirm } = this.state;
    return(
      <AuthForm
        email={email}
        password={password}
        confirm={this.isLogin() ? null : confirm}
        callback={this.update}
      />
    )
  }

  renderSubmitButton(){
    const { isLoading } = this.state;
    const isEnabled = !isLoading && this.isInputValid();

    return(
      <Button.SpicyButton
        onClick={this.submit}
        disabled={!isEnabled}>
        {humanizeString(this.authType())}
      </Button.SpicyButton>
    );
  }

  renderAuthenticated(){
    if(!this.state.isAuthenticated) return null;
    return <Redirect to='/' />;
  }

  renderLoading(){
    if(!this.state.isLoading) return null;
    return(
      <Layout.ThemePage>
        <CenterLoader contrast={true}/>
      </Layout.ThemePage>
    )
  }

  submit(){
    const { email, password } = this.state;
    const payload = { email: email, password: password };
    this.setState((s) => ({...s, isLoading: true}));
    const ep = `/auth/${this.authType()}`;
    const receivers = [this.onAuthSuccess, this.onAuthFailure];
    Backend.raisingPost(ep, payload, ...receivers);
  }

  update(key, value){
    this.setState(s => ({...s, [key]: value}));
  }

  onAuthSuccess(data){
    data = data['data'];
    Backend.kvSet('accessToken', data['accessToken']);
    Backend.kvSet('uid', data['id']);
    Backend.kvSet('email', data['email']);
    this.setState((s) => ({...s, isLoading: false, isAuthenticated: true}));
  }

  onAuthFailure(data){
    const reasons = (data && data.error || {} )['reasons'];
    const errors = reasons ? reasons : ['Unexpected server error :/'];
    this.setState((s) => ({...s, isLoading: false, errors }));
  }

  isInputValid(){
    let { email, password, confirm } = this.state;
    if(this.isLogin()){
      return email.length > 0 && password.length > 0;
    } else {
      password = password.replace(/^\s+|\s+$/g, '');
      if(!email.match(EMAIL_REGEX)) return false;
      if(password.length < 7) return false;
      if(password.includes(' ')) return false;
      // noinspection RedundantIfStatementJS
      if(password !== confirm) return false;
      return true;
    }
  }

  static defaultCredentials(){
    if(Utils.isNonDev()){
      return({email: '', password: '', confirm: ''})
    } else {
      return({
        email: 'xavier@codenectar.com',
        password: 'password',
        confirm: 'password'
      })
    }
  }

  authType(){ return this.props.match.path.split('/auth/')[1]; }
  isLogin(){ return this.authType() === 'login' }
}

const EMAIL_REGEX = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;