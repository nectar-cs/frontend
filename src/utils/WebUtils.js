import Cookies from "js-cookie";

export default class WebUtils{

  static fetchJson(endPoint, callback){
    let url = `http://localhost:3000${endPoint}`;
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
    let url = `http://localhost:3000${endPoint}`;
    fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Token': this.accessToken()
      },
      body: JSON.stringify(hash)
    }).then(res => res.json())
      .then(
        (parsed_result) => { callback(parsed_result) },
        (error) => { console.log(error); }
      );
  }

  static kvGet(key){
    return Cookies.get(key);
  }

  static kvSet(key, value){
    return Cookies.set(key, value);
  }

  static accessToken(){
    return WebUtils.kvGet('accessToken');
  }

}