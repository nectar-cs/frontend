import Backend from '../../utils/Backend';
import { setAuthenticated } from '../../actions/profileAction';
import { connect } from "react-redux";
import React from 'react';
import { Redirect } from 'react-router';
import { ROUTES } from '../../containers/RoutesConsts';
import CenterLoader from '../../widgets/CenterLoader/CenterLoader';

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
    };
  }

  componentDidMount(){
    let endpoint = '/auth/authenticate';
    Backend.raisingFetch(endpoint, (response) => {
      this.setState((state) => {
        const success = !!response['data'];
        const authCheck = success ? AUTH_CHECK.AUTHENTICATED : AUTH_CHECK.INVALID;
        if(success)
          this.props.setAuthenticated(response['data']);
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
