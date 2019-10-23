import React from 'react';
import { Redirect } from 'react-router';
import AppLayout from '../components/Navigation/AppLayout/AppLayout';
import { ROUTES } from '../containers/RoutesConsts';
import Backend from "../utils/Backend";
import {setModalOps} from "../actions/action";
import {connect} from "react-redux";

function d2P(dispatch){
  return {
    setOpenModal: a => dispatch(setModalOps(a))
  }
}

export default class AuthenticatedComponent {

  static compose(WrappedComponent){

    function augmentedComp(props) {
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

    return connect(d2P)(augmentedComp);
  }
}

