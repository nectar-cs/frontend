import React from 'react'
import Backend from "../../utils/Backend";
import {Redirect} from "react-router";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import {ROUTES} from "../Root/RoutesConsts";
import {ThemeProvider} from "styled-components";
import Utils from "../../utils/Utils";
import {Layout, theme} from "ui-common";

export default class Logout extends React.Component{

  constructor(props) {
    super(props);
    this.state = { isDone: false };
  }

  async componentDidMount(){
    Utils.mp("Logout", {});
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