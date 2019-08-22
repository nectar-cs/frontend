import React from 'react';
import MiscUtils from "../../utils/MiscUtils";
import s from "./LoginAndRegister.sass";
import is from "../../assets/input-combos.sass";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import Backend from "../../utils/Backend";
import {setSignedIn} from "../../actions/profileAction";
import {connect} from "react-redux";

export class RegisterClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      authenticated: false,
      errors: [],
      isLoading: false
    };
    this.fieldRefs = {
      email: React.createRef(),
      password: React.createRef()
    };
    this.submit = this.submit.bind(this);
    this.onRegisterSuccess = this.onRegisterSuccess.bind(this);
    this.onRegisterFailed = this.onRegisterFailed.bind(this);
  }

  render(){
    if (this.state.authenticated) {
      return RegisterClass.renderAuthenticated();
    } else {
      if(this.state.isLoading)
        return this.renderLoading();
      else return this.renderUnauthenticated();
    }
  }

  renderUnauthenticated(){
    const image = MiscUtils.image('nectar_mark_light.png');
    return(
      <div className={s.container}>
        <div className={s.content}>
          <div className={s.titleBox}>
            <img className={s.titleLogo} src={image} alt={'Nectar'} />
            <h1 className={s.titleText}>mosaic</h1>
          </div>
          <div className={s.formBox}>
            { this.renderEmailField() }
            { this.renderPasswordField() }
            { this.isLogin() ? null : this.renderRePasswordField() }
            { this.renderSubmitButton() }
            { this.renderRegisterButton() }
          </div>
        </div>
        <ul className={s.errorBox}>{this.renderErrors()}</ul>
      </div>
    )
  }

  renderLoading(){
    const image = MiscUtils.image('nectar_mark_light.png');
    return(
      <div className={s.container}>
        <div className={s.content}>
          <div className={s.titleBox}>
            <img className={s.titleLogo} src={image} alt={'Nectar'} />
            <h1 className={s.titleText}>mosaic</h1>
            <div className={s.contrastLoader}/>
          </div>
        </div>
        <ul className={s.errorBox}>{this.renderErrors()}</ul>
      </div>
    )
  }

  renderSubmitButton(){
    return <button
      onClick={this.submit}
      className={is.formSubmitContrast}>
      {this.isLogin() ? 'Login' : 'Register'}
    </button>
  }

  renderErrors(){
    return this.state.errors.map((e) => (
     <li key={e}><p className={s.error}>{e}</p></li>
    ));
  }

  static renderAuthenticated(){
    return<Redirect to='/' />;
  }

  renderRegisterButton(){
    const link = `/auth/${this.isLogin() ? 'register' : 'login'}`;
    const para = this.isLogin() ? 'Register' : 'Login';
    return <Link to={link}>
      <p className={s.registerLink}>Or, {para}</p>
    </Link>
  }

  isLogin(){
    return this.props.match.path === '/auth/login';
  }

  renderEmailField(){
    return(
      <input
        ref={this.fieldRefs['email']}
        className={is.cleanTextInput}
        placeholder='email'
        defaultValue='xavier@codenectar.com'
      />
    )
  }

  renderPasswordField(){
    return(
      <input
        ref={this.fieldRefs['password']}
        type='password'
        className={is.cleanTextInput}
        placeholder='password'
        defaultValue='password'
      />
    )
  }

  renderRePasswordField(){
    return(
      <input
        ref={this.fieldRefs['password-confirm']}
        type='password'
        className={is.cleanTextInput}
        placeholder='confirm password'
        defaultValue='password'
      />
    )
  }

  submit(){
    const email = this.fieldRefs['email'].current.value;
    const password = this.fieldRefs['password'].current.value;
    const payload = { email: email, password: password };
    this.setState((s) => ({...s, isLoading: true}));
    Backend.postJsonWithErr(
      `/auth/${this.isLogin() ? 'login' : 'register'}`,
      payload,
      this.onRegisterSuccess,
      this.onRegisterFailed
    )
  }

  onRegisterSuccess(data){
    this.props.setSignedIn(data['accessToken']);
    this.setState((s) => ({...s, isLoading: false, authenticated: true}));
  }

  onRegisterFailed(data){
    this.setState((s) => ({...s, isLoading: false, errors: data['reasons']}));
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setSignedIn: bundle => dispatch(setSignedIn(bundle))
  };
}

const connector = connect(null, mapDispatchToProps);
const LoginAndRegister = connector(RegisterClass);
export default LoginAndRegister;
