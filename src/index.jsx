import React from 'react';
import ReactDOM from 'react-dom';
import './app.global.sass'
import { store, history } from './store/store';
import Root from "./containers/Root";
import * as Sentry from "@sentry/browser";
import mixpanel from 'mixpanel-browser';
import MiscUtils from "./utils/MiscUtils";
import Backend from "./utils/Backend";

if(MiscUtils.hasSentry())
  Sentry.init({dsn: MiscUtils.SENTRY_DSN});

if(MiscUtils.hasMixPanel()) {
  try{
    mixpanel.init(MiscUtils.MP_TOKEN);
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

if (module.hot) {
  module.hot.accept();
}