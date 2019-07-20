import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import profileReducer from './profileReducer';

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    profileReducer: profileReducer
  });
}
