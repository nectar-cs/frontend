import React from 'react';
import SideBar from './../SideBar/SideBar'
import TopBar from './../TopBar/TopBar'
import {theme} from "../../../assets/constants";
import {ThemeProvider} from "styled-components";
import {AppContent} from "./AppLayoutStyles";

export default class AppLayout extends React.Component {
  render(){
    return(
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <TopBar/>
          <SideBar/>
          <AppContent>
            { this.props.children }
          </AppContent>
        </React.Fragment>
      </ThemeProvider>
    )
  }
}