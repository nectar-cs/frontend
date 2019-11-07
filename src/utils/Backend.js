import Cookies from "js-cookie";
import DataUtils from "./DataUtils";

export default class Backend {

  static baseUrl(){
    if(process.env.NODE_ENV === 'development'){
      return 'http://localhost:3000';
    } else {
      return BACKEND_URL;
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

  static url(endpoint){
    return `${this.baseUrl()}${endpoint}`;
  }

  static prepReq(method, body){
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Token': this.accessToken()
    };

    body = body ? JSON.stringify(body) : null;
    return { method, headers, body };
  }

  static async bFetch(endpoint){
    const raw = await this.blockingRequest('GET', endpoint, null);
    if(raw){
      let cleaned = DataUtils.obj2Camel(raw);
      return cleaned['data'] ? cleaned['data'] : cleaned;
    } else return null;
  }

  static async bPost(endpoint, payload){
    payload = DataUtils.obj2Snake(payload);
    const raw = await this.blockingRequest('POST', endpoint, payload);
    let cleaned = DataUtils.obj2Camel(raw);
    return cleaned['data'] ? cleaned['data'] : cleaned;
  }

  static async bDelete(endpoint){
    const raw = await this.blockingRequest('DELETE', endpoint);
    let cleaned = DataUtils.obj2Camel(raw);
    return cleaned['data'] ? cleaned['data'] : cleaned;
  }

  static async blockingRequest(method, endpoint, body){
    const response = await fetch(this.url(endpoint), this.prepReq(method, body));
    return response.ok ? DataUtils.obj2Camel(await response.json()) : null;
  }

  static raisingRequest(method, endpoint, body, callback, errorCallback){
    fetch(this.url(endpoint), this.prepReq(method, body))
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
        const bundle = { kind: "hard", error, status: error.status };
        errorCallback && errorCallback(bundle);
      }
    )
  }

  static postJsonWithErr(endPoint, hash, callback, errorCallback, method='POST'){
    let url = `${this.baseUrl()}${endPoint}`;
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

  static accessToken(){
    return Backend.kvGet('accessToken');
  }
}