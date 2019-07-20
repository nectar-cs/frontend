import WebUtils from '../../utils/WebUtils';
import { setAuthenticated } from '../../actions/profileAction';
import { connect } from "react-redux";
import React from 'react';
import { Redirect } from 'react-router';
import { ROUTES } from '../../containers/RoutesConsts';
import CenterLoader from '../../widgets/CenterLoader/CenterLoader';

const CLUSTER_CHECK = {
  PENDING: 'pending',
  READY: 'success',
  NEEDS_CONFIG: 'failure'
};

const AUTH_CHECK = {
  FETCHING: 'fetching',
  AUTHENTICATED: 'success',
  INVALID: 'failure'
};

class AuthenticateClass extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authCheck: AUTH_CHECK.FETCHING,
      clusterCheck: CLUSTER_CHECK.PENDING
    };
  }

  componentDidMount(){
    let endpoint = '/auth/authenticate';
    WebUtils.fetchJson(endpoint, (response) => {
      this.setState((state) => {
        const success = !!response['data'];
        const authCheck = success ? AUTH_CHECK.AUTHENTICATED : AUTH_CHECK.INVALID;
        if(success) {
          this.props.setAuthenticated(response['data']);
          this.checkClusters();
        }
        return ({...state, authCheck});
      });
    });
  }

  checkClusters(){
    WebUtils.fetchJson('/clusters', (response) => {
      const isReady = response['data'].length > 0;
      const state = isReady ? CLUSTER_CHECK.READY : CLUSTER_CHECK.NEEDS_CONFIG;
      this.setState((s) => ({ ...s, clusterCheck: state}));
    });
  }

  render() {
    if(this.state.authCheck === AUTH_CHECK.AUTHENTICATED){
      if(this.state.clusterCheck === CLUSTER_CHECK.READY)
        return <Redirect to={'/'}/>;
      else if(this.state.clusterCheck === CLUSTER_CHECK.NEEDS_CONFIG)
        return <Redirect to={ROUTES.clusters.connect}/>;
      else return AuthenticateClass.renderLoading();
    } else if(this.state.authCheck === AUTH_CHECK.INVALID){
      return <Redirect to={ROUTES.auth.login.path}/>;
    } else if(this.state.authCheck === AUTH_CHECK.FETCHING) {
      return AuthenticateClass.renderLoading();
    }
  }

  static renderLoading(){
    return <CenterLoader/>;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setAuthenticated: bundle => dispatch(setAuthenticated(bundle))
  };
}

const connector = connect(null, mapDispatchToProps);
const Authenticate = connector(AuthenticateClass);
export default Authenticate;
