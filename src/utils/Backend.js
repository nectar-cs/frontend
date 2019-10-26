import Cookies from "js-cookie";

const DEFAULT_URL = "http://localhost:3000";
const BACKEND_URL = process.env['BACKEND_URL'] || DEFAULT_URL;

export default class Backend {

  static baseUrl(){
    if(process.env.NODE_ENV){

    }
  }

  static raisingFetch(endpoint, callback, errorCallback=null){
    this.raisingRequest('GET', endpoint, null, callback, errorCallback);
  }

  static raisingPost(endpoint, payload, callback, errorCallback=null){
    this.raisingRequest('POST', endpoint, payload, callback, errorCallback);
  }

  static raisingDelete(endpoint, callback, errorCallback=null){
    this.raisingRequest('DELETE', endpoint, null, callback, errorCallback);
  }

  static raisingRequest(method, endpoint, body, callback, errorCallback){
    let url = `${BACKEND_URL}${endpoint}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Token': this.accessToken()
    };

    body = body ? JSON.stringify(body) : null;

    fetch(url, {method, headers, body})
    .then(
      (response) => (
        response.json().then(
          (data) => {
            if(response.ok){
              if(callback) callback(data);
              else return data;
            } else {
              if(errorCallback) {
                errorCallback && errorCallback({
                  kind: "soft",
                  error: data,
                  status: response.status
                })
              }
            }
          }
        )
      ),
      (error) => {
        const bundle = {
          kind: "hard",
          error,
          status: error.status
        };
        errorCallback && errorCallback(bundle);
      }
    )
  }

  static postJson(endPoint, hash, callback, method='POST'){
    this.postJsonWithErr(endPoint, hash, callback, null, method);
  }

  static postJsonWithErr(endPoint, hash, callback, errorCallback, method='POST'){
    let url = `${BACKEND_URL}${endPoint}`;
    fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Token': this.accessToken()
      },
      body: JSON.stringify(hash)
    }).then(result => {
        if (result.ok) return result.json();
        else throw result;
      }
    )
    .then((parsed_result) => {
      callback(parsed_result)
    })
    .catch(error => {
      error.json().then((body) => { errorCallback && errorCallback(body)});
    })
  }

  static kvGet(key){
    return Cookies.get(key);
  }

  static kvSet(key, value){
    return Cookies.set(key, value);
  }

  static kvUnset(key){
    return Cookies.set(key, value);
  }

  static accessToken(){
    return Backend.kvGet('accessToken');
  }
}