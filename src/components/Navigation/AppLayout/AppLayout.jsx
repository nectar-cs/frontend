import React from 'react';
import SideBar from './../SideBar/SideBar'
import TopBar from './../TopBar/TopBar'
import {theme} from "../../../assets/constants";
import {ThemeProvider} from "styled-components";
import {AppContent} from "./AppLayoutStyles";
import Backend from "../../../utils/Backend";
import {setWorkspaces} from "../../../actions/action";
import {connect} from "react-redux";
import DataUtils from "../../../utils/DataUtils";

class AppLayoutClass extends React.Component {
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

  componentDidMount(){
    Backend.raisingFetch(`/workspaces`, resp => {
      const workspaces = DataUtils.objKeysToCamel(resp['data']);
      console.log("SETTING");
      console.table(workspaces);
      this.props.setWorkspaces(workspaces);
    });
  }
}

function d2P(dispatch){
  return {
    setWorkspaces: (a) => dispatch(setWorkspaces(a))
  }
}

const AppLayout = connect(null, d2P)(AppLayoutClass);
export default AppLayout;