import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Link, hashHistory } from 'react-router'
import { Provider } from 'react-redux'

import store from '../store';
import App from './app.jsx';

/**
 * All routes in APP
 * @type {XML}
 */
const routes =
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
      </Route>
    </Router>
  </Provider>;

export default routes;