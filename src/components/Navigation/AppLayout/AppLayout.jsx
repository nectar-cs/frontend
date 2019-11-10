import React from 'react';
import SideBar from './../SideBar/SideBar'
import TopBar from './../TopBar/TopBar'
import {theme} from "../../../assets/constants";
import {ThemeProvider} from "styled-components";
import {AppContent} from "./AppLayoutStyles";
import Backend from "../../../utils/Backend";
import {setPath, setRemotes, setWorkspaces} from "../../../actions/action";
import {connect} from "react-redux";
import DataUtils from "../../../utils/DataUtils";
import mixpanel from "mixpanel-browser";

class AppLayoutClass extends React.Component<Props> {
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

  componentDidUpdate(nextProps){
    nextProps.setPath(window.location.pathname);
  }

  componentDidMount(){
    if(this.props.skipSetup) return;
    Backend.raisingFetch(`/workspaces`, resp => {
      this.props.setWorkspaces(DataUtils.obj2Camel(resp['data']));
    });
    Backend.raisingFetch(`/remotes/connected`, resp => {
      this.props.setRemotes(DataUtils.obj2Camel(resp['data']));
    });
  }
}

type Props = {
  skipSetup: ?boolean
}

function d2P(dispatch){
  return {
    setWorkspaces: (a) => dispatch(setWorkspaces(a)),
    setRemotes: (a) => dispatch(setRemotes(a)),
    setPath: (a) => dispatch(setPath(a))
  }
}

const AppLayout = connect(null, d2P)(AppLayoutClass);
export default AppLayout;