import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import AppLayout from '../components/Navigation/AppLayout/AppLayout';
import { ROUTES } from '../containers/RoutesConsts';

export default class AuthenticatedComponent {
  static compose(WrappedComponent){
    const DecisionComponent = function(props) {

      const session = props.session;
      if(session && session.accessToken){
        return(
          <AppLayout>
            <WrappedComponent {...props} />
          </AppLayout>
        )
      } else {
        return <Redirect to={ROUTES.auth.login.path}/>
      }
    };

    const map = (s) => ({ session: s.profileReducer });
    const connector = connect(map, null);
    return connector(DecisionComponent);
  }
}