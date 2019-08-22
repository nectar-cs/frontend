import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom'
import { ROUTES as R} from './RoutesConsts';
import {Switch} from "react-router";

export default class Root extends Component {
  render() {
    // const subs = { [SUBS.ID]: 11, [SUBS.CONCERN]: 'general' };
    // const home = makeRoute(ROUTES.specs.edit, subs);
    const home = R.deployments.detect;
    // const home = R.deployments.index;
    // const home = ROUTES.clusters.connect;

    return (
      <Provider store={this.props.store}>
        <BrowserRouter>
          <Switch>
            { Root.renderRoute(R.auth.authenticate) }
            { Root.renderRoute(R.auth.login) }
            { Root.renderRoute(R.auth.register) }
            { Root.renderRoute(R.deployments.index) }
            { Root.renderRoute(R.deployments.detect) }
            <Route path={'/'} exact component={home.comp}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }

  static renderRoute(hash, props={}){
    return <Route path={hash.path} component={hash.comp} />;
  }

}
