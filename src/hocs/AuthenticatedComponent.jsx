import React from 'react';
import { Redirect } from 'react-router';
import AppLayout from '../components/Navigation/AppLayout/AppLayout';
import { ROUTES } from '../containers/RoutesConsts';
import Backend from "../utils/Backend";
import {setModalOps} from "../actions/action";
import {connect} from "react-redux";

export default class AuthenticatedComponent {

  static compose(WrappedComponent){

    return function (props) {
      if(Backend.accessToken()){
        return(
          <AppLayout>
            <WrappedComponent
              {...props}
            />
          </AppLayout>
        )
      } else {
        return <Redirect to={ROUTES.auth.login.path}/>
      }
    }
  }
}

