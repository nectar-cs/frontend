import Backend from '../../utils/Backend';
import React from 'react';
import { Redirect } from 'react-router';
import { ROUTES } from '../../containers/RoutesConsts';
import CenterLoader from '../../widgets/CenterLoader/CenterLoader';

const AUTH_CHECK = {
  FETCHING: 'fetching',
  AUTHENTICATED: 'success',
  INVALID: 'failure'
};

export default class Authenticate extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authCheck: AUTH_CHECK.FETCHING,
    };
  }

  componentDidMount(){
    let endpoint = '/auth/authenticate';
    Backend.raisingFetch(endpoint, (response) => {
      this.setState((state) => {
        const success = !!response['data'];
        const authCheck = success ? AUTH_CHECK.AUTHENTICATED : AUTH_CHECK.INVALID;
        return ({...state, authCheck});
      });
    });
  }

  render() {
    if(this.state.authCheck === AUTH_CHECK.AUTHENTICATED){
      return <Redirect to={'/'}/>;
    } else if(this.state.authCheck === AUTH_CHECK.INVALID){
      return <Redirect to={ROUTES.auth.login.path}/>;
    } else if(this.state.authCheck === AUTH_CHECK.FETCHING) {
      return Authenticate.renderLoading();
    }
  }

  static renderLoading(){
    return <CenterLoader/>;
  }
}