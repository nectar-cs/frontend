import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import mainReducer from '../reducers/reducer';

const history = createHashHistory();

const reducer = combineReducers({
  router: connectRouter(history),
  mainReducer
});

const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);
const store = createStore(reducer, enhancer);

export default { store, history };

