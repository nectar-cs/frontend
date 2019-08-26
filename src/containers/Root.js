import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom'
import { ROUTES as R} from './RoutesConsts';
import {Switch} from "react-router";

export default class Root extends Component {
  render() {
    const home = R.workspaces.index;

    return (
      <Provider store={this.props.store}>
        <BrowserRouter>
          <Switch>
            { Root.renderRoute(R.auth.authenticate) }
            { Root.renderRoute(R.auth.login) }
            { Root.renderRoute(R.auth.register) }
            { Root.renderRoute(R.deployments.detect) }
            { Root.renderRoute(R.workspaces.index) }
            { Root.renderRoute(R.workspaces.new) }
            { Root.renderRoute(R.workspaces.show) }
            <Route path={'/'} exact component={home.comp}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }

  static renderRoute(hash){
    return <Route path={hash.path} exact component={hash.comp} />;
  }

}
