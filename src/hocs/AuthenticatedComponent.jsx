import React from 'react';
import { Redirect } from 'react-router';
import AppLayout from '../components/Navigation/AppLayout/AppLayout';
import { ROUTES } from '../containers/RoutesConsts';
import Backend from "../utils/Backend";
import type {LightUser} from "../types/Types";

export default class AuthenticatedComponent {

  static compose(WrappedComponent, bypassOnboarding = false){
    return class extends React.Component {
      constructor(props){
        super(props);
        this.state = {
          authConfirmation: null,
          onboardingNeeded: false
        };
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
        if(this.isAuthenticated()){
          if(this.wasOnboarded())
            return this.renderRegularComponent();
          else return <Redirect to={ROUTES.welcome.index.path}/>;
        } else return <Redirect to={ROUTES.auth.login.path}/>;
      }

      isAuthenticated(){
        const { authConfirmation } = this.state;
        return Backend.accessToken() && authConfirmation !== false;
      }

      wasOnboarded(){
        const { onboardingNeeded } = this.state;
        return true || bypassOnboarding || onboardingNeeded !== false;
      }

      renderRegularComponent(){
        return(
          <AppLayout>
            <WrappedComponent{...this.props}/>
          </AppLayout>
        )
      }

      onAuthConfirmed(user: LightUser) {
        this.setState(s => ({
          ...s,
          authConfirmation: true,
        }));
      }

      onAuthRejected(){ this.setState(s => ({...s, authConfirmation: false})); }
    }
  }
}
