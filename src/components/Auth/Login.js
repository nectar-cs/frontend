import React from 'react';
import s from './Login.sass'
import is from "../../assets/input-combos.sass"
import MiscUtils from '../../utils/MiscUtils';
import WebUtils from '../../utils/WebUtils';
import { Redirect } from 'react-router';
import { setSignedIn } from '../../actions/profileAction';
import {connect} from  'react-redux'


class LoginClass extends React.Component{

  constructor(props){
    super(props);
    this.state = { authenticated: false };
    this.fieldRefs = { email: React.createRef(), password: React.createRef() };
    this.submit = this.submit.bind(this);
  }

  render(){
    if (this.state.authenticated) {
      return LoginClass.renderAuthenticated();
    } else {
      return this.renderUnauthenticated();
    }
  }

  renderUnauthenticated(){
    const image = MiscUtils.image('nectar_mark_light.png');
    return(
      <div className={s.container}>
        <div className={s.content}>
          <div className={s.titleBox}>
            <img className={s.titleLogo} src={image} />
            <h1 className={s.titleText}>mosaic</h1>
          </div>
          <div className={s.formBox}>
            { this.renderEmailField() }
            { this.renderPasswordField() }
            <button onClick={this.submit} className={is.formSubmitContrast}>Login</button>
          </div>
        </div>
      </div>
    )
  }

  static renderAuthenticated(){
    return<Redirect to='/' />;
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

  submit(){
    const email = this.fieldRefs['email'].current.value;
    const password = this.fieldRefs['password'].current.value;
    const payload = { email: email, password: password };
    WebUtils.postJson('/auth/login', payload, (data) => {
      console.log("payload");
      console.log(data);
      this.setState((_) => {
        this.props.setSignedIn(data['accessToken']);
        return ({authenticated: true})
      });
    });
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setSignedIn: bundle => dispatch(setSignedIn(bundle))
  };
}

const connector = connect(null, mapDispatchToProps);
const Login = connector(LoginClass);
export default Login;
