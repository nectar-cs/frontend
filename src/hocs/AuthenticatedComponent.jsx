//@flow
import React from 'react';
import AppLayout from '../components/Navigation/AppLayout/AppLayout';

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