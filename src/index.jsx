import React from 'react';
import ReactDOM from 'react-dom';
import './app.global.sass'
import { store, history } from './store/store';
import Root from "./containers/Root";

ReactDOM.render(
  <Root store={store} history={history}/>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}