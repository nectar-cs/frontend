//@flow


const DEFAULT_URL = "http://localhost:5000";
const BACKEND_URL = process.env['KUBE_HANDLER_URL'] || DEFAULT_URL;

export default class KubeHandler {
  static filterFetch(endpoint, ws, callback, errorCallback=null){
    const nsFilterType = `ns_filter_type=${ws.nsFilterType}`;
    const nsFilter = `ns_filters=${ws.nsFilters.join(',')}`;

    const lbFilterType = `lb_filter_type=${ws.lbFilterType}`;
    const lbFilter = `lb_filters=${ws.lbFilters.join(',')}`;

    const args = `${nsFilterType}&${nsFilter}&${lbFilterType}&${lbFilter}`;
    endpoint = `${endpoint}?${args}&full=true`;

    this.raisingFetch(endpoint, callback, errorCallback);
  }

  static raisingFetch(endpoint, callback, errorCallback=null){
    let url = `${BACKEND_URL}${endpoint}`;
    fetch(url, {method: 'GET'})
    .then(
      (response) => (
        response.json().then(
          (data) => {
            if(response.ok){
              if(callback) callback(data);
              else return data;
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