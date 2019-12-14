import React from 'react';
import { Redirect } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../assets/constants';
import Layout from '../../assets/layouts';
import { ROUTES } from '../../containers/RoutesConsts';
import Backend from '../../utils/Backend';
import Utils from '../../utils/Utils';
import CenterLoader from '../../widgets/CenterLoader/CenterLoader';

export default class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isDone: false };
  }

  async componentDidMount() {
    Utils.mp('Logout', {});
    await Backend.bDelete('/auth/logout');
    Backend.clearAccessToken();
    this.setState(s => ({ ...s, isDone: true }));
  }

  render() {
    if (this.state.isDone) return this.renderRedirect();
    return this.renderLoading();
  }

  renderLoading() {
    return (
      <ThemeProvider theme={theme}>
        <Layout.ThemePage>
          <CenterLoader contrast={true} />
        </Layout.ThemePage>
      </ThemeProvider>
    );
  }

  renderRedirect() {
    return <Redirect to={ROUTES.auth.login.path} />;
  }
}
