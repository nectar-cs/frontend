import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Provider } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom'
import {ROUTES as R} from './RoutesConsts';
import {Switch} from "react-router";
import NotFound from "../NotFound/NotFound";
import {theme} from "ui-common";
import {ThemeProvider} from "styled-components";

export default class Root extends Component {

  render() {
    return (
      <Provider store={this.props.store}>
        <BrowserRouter history={this.props.history}>
          <ThemeProvider theme={theme}>
            <Switch>
              { Root.renderRoute(R.auth.login) }
              { Root.renderRoute(R.auth.register) }
              { Root.renderRoute(R.auth.logout) }
              { Root.renderRoute(R.bulkMatch.index) }
              { Root.renderRoute(R.deployments.debug) }
              { Root.renderRoute(R.deployments.show) }
              { Root.renderRoute(R.workspaces.index) }
              { Root.renderRoute(R.workspaces.new) }
              { Root.renderRoute(R.workspaces.edit) }
              { Root.renderRoute(R.workspaces.show) }
              <Route path='/' exact component={R.workspaces.default.comp} />
              <Route component={NotFound}/>
            </Switch>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }

  static renderRoute(hash){
    return <Route path={hash.path} exact component={hash.comp} />;
  }

  static propTypes = {
    store: PropTypes.any.isRequired,
    history: PropTypes.any.isRequired,
  }
}