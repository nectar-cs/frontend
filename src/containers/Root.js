import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Provider } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom'
import {makeRoute, ROUTES as R} from './RoutesConsts';
import {Redirect, Switch} from "react-router";
import NotFound from "../components/NotFound/NotFound";
import Debug from "../components/NotFound/Debug";

export default class Root extends Component {

  render() {
    return (
      <Provider store={this.props.store}>
        <BrowserRouter history={this.props.history}>
          <Switch>
            { Root.renderRoute(R.auth.authenticate) }
            { Root.renderRoute(R.auth.login) }
            { Root.renderRoute(R.auth.register) }
            { Root.renderRoute(R.auth.logout) }
            { Root.renderRoute(R.welcome.index) }
            { Root.renderRoute(R.bulkMatch.index) }
            { Root.renderRoute(R.deployments.debug) }
            { Root.renderRoute(R.deployments.show) }
            { Root.renderRoute(R.workspaces.index) }
            { Root.renderRoute(R.workspaces.new) }
            { Root.renderRoute(R.workspaces.edit) }
            { Root.renderRoute(R.workspaces.show) }
            <Route path='/debugz' exact component={Debug} />
            <Route path='/' exact component={R.workspaces.default.comp} />
            <Route component={NotFound}/>
          </Switch>
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