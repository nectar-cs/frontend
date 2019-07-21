
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
}