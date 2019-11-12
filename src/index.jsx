import React from 'react';
import ReactDOM from 'react-dom';
import './app.global.sass'
import { store, history } from './store/store';
import Root from "./containers/Root";
import * as Sentry from "@sentry/browser";
import mixpanel from 'mixpanel-browser';
import Utils from "./utils/Utils";
import Backend from "./utils/Backend";

if(Utils.hasSentry())
  Sentry.init({dsn: Utils.SENTRY_DSN});

if(Utils.hasMixPanel()) {
  try{
    mixpanel.init(Utils.MP_TOKEN);
    mixpanel.identify(Backend.kvGet('uid'));
    mixpanel.people.set({"$email": Backend.kvGet('email')});
  } catch(e) {
    Sentry.captureException(e)
  }
}

ReactDOM.render(
  <Root store={store} history={history}/>,
  document.getElementById('root')
);

if(module.hot)
  module.hot.accept();