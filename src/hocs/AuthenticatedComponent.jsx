import React from 'react';
import { Redirect } from 'react-router';
import AppLayout from '../components/Navigation/AppLayout/AppLayout';
import { ROUTES } from '../containers/RoutesConsts';
import Backend from "../utils/Backend";

export default class AuthenticatedComponent {
  static compose(WrappedComponent){
    return function(props) {
      if(Backend.accessToken()){
        return(
          <AppLayout>
            <WrappedComponent {...props} />
          </AppLayout>
        )
      } else {
        return <Redirect to={ROUTES.auth.login.path}/>
      }
    };
  }
}