import React from 'react'
import Backend from "../../utils/Backend";
import {Redirect} from "react-router";
import Layout from "../../assets/layouts";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import {ROUTES} from "../../containers/RoutesConsts";
import {theme} from "../../assets/constants";
import {ThemeProvider} from "styled-components";

export default class Logout extends React.Component{

  constructor(props) {
    super(props);
    this.state = { isDone: false };
  }

  async componentDidMount(){
    await Backend.bDelete('/auth/logout');
    Backend.clearAccessToken();
    this.setState(s => ({...s, isDone: true}));
  }

  render(){
    if(this.state.isDone)
      return this.renderRedirect();
    else return this.renderLoading()
  }

  renderLoading(){
    return(
      <ThemeProvider theme={theme}>
        <Layout.ThemePage>
          <CenterLoader contrast={true}/>
        </Layout.ThemePage>
      </ThemeProvider>
    )
  }

  renderRedirect(){
    return <Redirect to={ROUTES.auth.login.path}/>
  }
}