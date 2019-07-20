import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom'
import { ROUTES as R} from './RoutesConsts';
import {Switch} from "react-router";

export default class Root extends Component {
  render() {
    // const subs = { [SUBS.ID]: 11, [SUBS.CONCERN]: 'general' };
    // const home = makeRoute(ROUTES.specs.edit, subs);
    // const home = ROUTES.sysObjects.index;
    const home = R.team.githubAuth;
    // const home = ROUTES.clusters.connect;

    return (
      <Provider store={this.props.store}>
        <BrowserRouter>
          <Switch>
            { Root.renderRoute(R.auth.authenticate) }
            { Root.renderRoute(R.auth.login) }
            { Root.renderRoute(R.team.githubAuth) }
            <Route path={'/'} exact component={home.comp}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }

  static renderRoute(hash){
    return <Route path={hash.path} component={hash.comp}/>;
  }

}
