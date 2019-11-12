import React, {Fragment} from 'react';
import MiscUtils from "../../utils/MiscUtils";
import is from "../../assets/input-combos.sass";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import Backend from "../../utils/Backend";
import Layout from "../../assets/layouts";
import S from './Styles';
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import AuthForm from "./AuthForm";
import Text from "../../assets/text-combos";

const humanizeString = require('humanize-string');

export default class LoginAndRegister extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      authenticated: false,
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
        confirm={confirm}
        callback={this.update}
      />
    )
  }

  renderSubmitButton(){
    return(
      <button
        onClick={this.submit}
        className={is.formSubmitContrast}>
        {humanizeString(this.authType())}
      </button>
    );
  }

  renderAuthenticated(){
    if(!this.state.authenticated) return null;
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
    this.setState((s) => ({...s, isLoading: false, authenticated: true}));
  }

  onAuthFailure(data){
    const reasons = (data && data.error || {} )['reasons'];
    const errors = reasons ? reasons : ['Unexpected server error :/'];
    this.setState((s) => ({...s, isLoading: false, errors }));
  }

  static defaultCredentials(){
    if(MiscUtils.isNonDev()){
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
}

function MainLayout({children, errors, type}){
  const image = MiscUtils.image('nectar_mark_light.png');
  const Errors = () => errors.map((e) => (
    <li key={e}>
      <Text.P raw emotion='warn'>{e}</Text.P>
    </li>
  ));

  return(
    <Layout.ThemePage>
      <S.Content>
        <S.TitleBox>
          <S.TitleLogo src={image} alt={'Nectar'} />
          <S.TitleText>mosaic</S.TitleText>
        </S.TitleBox>
        { children }
        <SwitchType type={type}/>
      </S.Content>
      <S.ErrorBox>
        <Errors/>
      </S.ErrorBox>
    </Layout.ThemePage>
  )
}

function SwitchType({type}){
  const authTypes = ['login', 'register'];
  const opposite = authTypes[(authTypes.indexOf(type) + 1) % 2];

  return(
    <Link to={`/auth/${opposite}`}>
      <S.RegisterLink>Or, {humanizeString(opposite)}</S.RegisterLink>
    </Link>
  );
}
