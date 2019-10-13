import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Provider } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom'
import { ROUTES as R} from './RoutesConsts';
import {Switch} from "react-router";

export default class Root extends Component {

  componentDidMount(){
    console.log("MOUNT");
  }

  render() {
    const home = R.deployments.detect;
    return (
      <Provider store={this.props.store}>
        <BrowserRouter history={this.props.history}>
          <Switch>
            { Root.renderRoute(R.auth.authenticate) }
            { Root.renderRoute(R.auth.login) }
            { Root.renderRoute(R.auth.register) }
            { Root.renderRoute(R.deployments.detect) }
            { Root.renderRoute(R.deployments.show) }
            { Root.renderRoute(R.workspaces.index) }
            { Root.renderRoute(R.workspaces.new) }
            { Root.renderRoute(R.workspaces.edit) }
            { Root.renderRoute(R.workspaces.show) }
            { Root.renderRoute(R.experiments.networkTest) }
            <Route path={'/'} exact component={home.comp}/>
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
