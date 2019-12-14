import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import mainReducer from '../reducers/reducer';

const history = createHashHistory();

const reducer = combineReducers({
  router: connectRouter(history),
  mainReducer,
});

const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);
const store = createStore(reducer, enhancer);

export default { store, history };
