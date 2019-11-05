import DataUtils from "./DataUtils";

export default class Kapi {


  static baseUrl(){
    if(process.env.NODE_ENV === 'development'){
      return 'http://localhost:5000';
    } else {
      return "kapi.nectar:5000";
    }
  }


  static filterFetch(endpoint, ws, callback, errorCallback=null){
    const nsFilterType = `ns_filter_type=${ws.nsFilterType}`;
    const nsFilter = `ns_filters=${ws.nsFilters.join(',')}`;

    const lbFilterType = `lb_filter_type=${ws.lbFilterType}`;
    const lbFilter = `lb_filters=${ws.lbFilters.join(',')}`;

    const args = `${nsFilterType}&${nsFilter}&${lbFilterType}&${lbFilter}`;
    endpoint = `${endpoint}?${args}&full=true`;

    this.fetch(endpoint, callback, errorCallback);
  }

  static fetch(endpoint, callback, errorCallback=null){
    this.raisingRequest('GET', endpoint, null, callback, errorCallback);
  }

  static post(endpoint, body, callback, errorCallback=null){
    this.raisingRequest('POST', endpoint, body, callback, errorCallback);
  }

  static prepReq(method = null, body = null){
    body = body ? JSON.stringify(body) : null;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return  {method: method || 'GET', headers, body};
  }

  static url(endpoint){
    return `${this.baseUrl()}${endpoint}`;
  }

  static async blockingFetch(endpoint){
    const result = await this.blockingRequest('GET', endpoint, null);
    return DataUtils.obj2Camel(result);
  }

  static async blockingPost(endpoint, payload){
    payload = DataUtils.obj2Snake(payload);
    return await this.blockingRequest('POST', endpoint, payload)
  }

  static async blockingRequest(method, endpoint, body){
    const finalUrl = this.url(endpoint);
    const bodyAndHeaders = this.prepReq(method, body);
    const response = await fetch(finalUrl, bodyAndHeaders);
    return await response.json();
  }

  static raisingRequest(method, endpoint, body, callback, errorCallback=null){
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
        const bundle = {
          kind: "hard",
          error,
          status: error.status
        };
        errorCallback && errorCallback(bundle);
      }
    )
  }
}