//@flow
import React from 'react';
import { Redirect } from 'react-router';
import AppLayout from '../components/Navigation/AppLayout/AppLayout';
import { ROUTES } from '../containers/RoutesConsts';
import Backend from '../utils/Backend';
import type { LightUser } from '../types/Types';

/**
 * This is essentially legacy logic.
 * Keeping for when we bring back the option of having
 * a remote backend.
 */
export default class AuthenticatedComponent {
  static compose(WrappedComponent) {
    return class extends React.Component {
      render() {
        return (
          <AppLayout>
            <WrappedComponent {...this.props} />
          </AppLayout>
        );
      }
    };
  }
}