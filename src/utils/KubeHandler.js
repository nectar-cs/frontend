
const DEFAULT_URL = "http://localhost:5000";
const BACKEND_URL = process.env['KUBE_HANDLER_URL'] || DEFAULT_URL;

export default class KubeHandler {
  static fetchJson(endPoint, callback){
    let url = `${BACKEND_URL}${endPoint}`;
    fetch(url, {method: 'GET'})
    .then(res => res.json())
    .then((result) =>  callback(result))
    .catch(error => {
      console.log(`WE HAVE ERROR for ${endPoint}`);
      console.log(error);
    })
  }

  static raisingFetch(endpoint, callback, errorCallback=null){
    let url = `${BACKEND_URL}${endpoint}`;
    fetch(url, {
      method: 'GET',
    })
    .then(
      (response) => (
        response.json().then(
          (data) => {
            if(response.ok){
              callback && callback(data);
            } else {
              if(errorCallback) {
                errorCallback && errorCallback({ kind: "soft", error: data })
              }
            }
          }
        )
      ),
      (error) => {
        const bundle = { kind: "hard", error};
        errorCallback && errorCallback(bundle);
      }
    )
  }
}