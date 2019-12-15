import React from 'react';
import ReactDOM from 'react-dom';
import './app.global.sass'
import { store, history } from './store/store';
import Root from "./components/Root/Root";
import * as Sentry from "@sentry/browser";
import Utils from "./utils/Utils";

if(Utils.hasSentry())
  Sentry.init({dsn: Utils.SENTRY_DSN});


ReactDOM.render(
  <Root store={store} history={history}/>,
  document.getElementById('root')
);

if(module.hot)
  module.hot.accept();