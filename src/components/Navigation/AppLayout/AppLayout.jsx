import React, { Fragment } from 'react';
import SideBar from './../SideBar/SideBar';
import TopBar from './../TopBar/TopBar';
import { AppContent } from './AppLayoutStyles';
import Backend from '../../../utils/Backend';
import { setPath, setRemotes, setWorkspaces } from '../../../actions/action';
import { connect } from 'react-redux';
import DataUtils from '../../../utils/DataUtils';

class AppLayoutClass extends React.Component<Props> {
  render() {
    return (
      <Fragment>
        <TopBar />
        <SideBar />
        <AppContent>{this.props.children}</AppContent>
      </Fragment>
    );
  }

  componentDidUpdate(nextProps) {
    nextProps.setPath(window.location.pathname);
  }

  componentDidMount() {
    if (this.props.skipSetup) return;
    Backend.aFetch(`/workspaces`, resp => {
      this.props.setWorkspaces(DataUtils.obj2Camel(resp['data']));
    });
    Backend.aFetch(`/remotes/connected`, resp => {
      this.props.setRemotes(DataUtils.obj2Camel(resp['data']));
    });
  }
}

type Props = {
  skipSetup: ?boolean,
};

function d2P(dispatch) {
  return {
    setWorkspaces: a => dispatch(setWorkspaces(a)),
    setRemotes: a => dispatch(setRemotes(a)),
    setPath: a => dispatch(setPath(a)),
  };
}

const AppLayout = connect(null, d2P)(AppLayoutClass);
export default AppLayout;
