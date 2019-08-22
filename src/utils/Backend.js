import Cookies from "js-cookie";

const DEFAULT_URL = "http://localhost:3000";
const BACKEND_URL = process.env['BACKEND_URL'] || DEFAULT_URL;

export default class Backend {
  static fetchJson(endPoint, callback){
    let url = `${BACKEND_URL}${endPoint}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Token': this.accessToken()
    };

    fetch(url, {method: 'GET', headers: headers})
    .then(res => res.json())
    .then((result) =>  callback(result))
    .catch(error => {
      console.log(`WE HAVE ERROR for ${endPoint}`);
      console.log(error);
    })
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

  static accessToken(){
    return Backend.kvGet('accessToken');
  }
}