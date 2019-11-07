import React from 'react';
import { Redirect } from 'react-router';
import AppLayout from '../components/Navigation/AppLayout/AppLayout';
import { ROUTES } from '../containers/RoutesConsts';
import Backend from "../utils/Backend";

export default class AuthenticatedComponent {

  static compose(WrappedComponent){
    return class extends React.Component {
      constructor(props){
        super(props);
        this.state = { authConfirmation: null };
        this.onAuthConfirmed = this.onAuthConfirmed.bind(this);
        this.onAuthRejected = this.onAuthRejected.bind(this);
      }

      componentDidMount() {
        Backend.raisingFetch(
          '/auth/authenticate',
          this.onAuthConfirmed,
          this.onAuthRejected
        )
      }

      render(){
        const { authConfirmation } = this.state;
        if(Backend.accessToken() && authConfirmation !== false){
          return this.renderRegularComponent()
        } else {
          return <Redirect to={ROUTES.auth.login.path}/>
        }
      }

      renderRegularComponent(){
        return(
          <AppLayout>
            <WrappedComponent{...this.props}/>
          </AppLayout>
        )
      }

      onAuthConfirmed(){ this.setState(s => ({...s, authConfirmation: true})); }
      onAuthRejected(){ this.setState(s => ({...s, authConfirmation: false})); }
    }
  }
}

