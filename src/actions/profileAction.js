import WebUtils from "../utils/WebUtils";
export const SIGN_IN = 'SIGN_IN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const SIGN_OUT = 'SIGN_OUT';

export function setSignedIn(accessToken){
  WebUtils.kvSet('accessToken', accessToken);
  const bundle = { accessToken, isSessionActive: false };
  return { type: SIGN_IN, bundle: bundle }
}

export function setAuthenticated(bundle){
  bundle.isSessionActive = true;
  return { type: AUTHENTICATE, bundle: bundle }
}