import React from 'react';
import ReactDOM from 'react-dom';
import './app.global.sass'
import { store, history } from './store/store';
import Root from "./containers/Root";
import * as Sentry from "@sentry/browser";

// Sentry.init({
//   dsn: "https://16c96800cc7442e4b53bb6c04bfe1e84@sentry.io/1796858"
// });

ReactDOM.render(
  <Root store={store} history={history}/>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}