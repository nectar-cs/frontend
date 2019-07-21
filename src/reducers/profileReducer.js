import { SIGN_IN, AUTHENTICATE, SIGN_OUT } from './../actions/profileAction'
import Cookies from 'js-cookie'
import Backend from '../utils/Backend';

const initialState = {
  isSessionActive: false,
  accessToken: Backend.kvGet('accessToken'),
  isClusterReady: false,
  firstName: null,
  isKubeAdmin: null
};

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_IN:
      return({...state, ...action.bundle});
    case AUTHENTICATE:
      return({...state, ...action.bundle});
    case SIGN_OUT:
      return({...state, ...initialState});
    default:
      return state;
  }
}
