import DataUtils from "./DataUtils";

export default class ForeignApi{

  static baseUrl(){ throw "Unimplemented!" }

  static url(endpoint) {
    return `${this.baseUrl()}${endpoint}`;
  }

  static async bFetch(endpoint) {
    const raw = await this.blockingRequest('GET', endpoint, null);
    if (raw) {
      let cleaned = DataUtils.obj2Camel(raw);
      return cleaned['data'] ? cleaned['data'] : cleaned;
    } else return null;
  }

  static async bPost(endpoint, payload) {
    payload = DataUtils.obj2Snake(payload);
    const raw = await this.blockingRequest('POST', endpoint, payload);
    if (raw) {
      let cleaned = DataUtils.obj2Camel(raw);
      return cleaned['data'] ? cleaned['data'] : cleaned;
    } else return null;
  }

  static async bPatch(endpoint, payload) {
    payload = DataUtils.obj2Snake(payload);
    const raw = await this.blockingRequest('PATCH', endpoint, payload);
    let cleaned = DataUtils.obj2Camel(raw);
    return cleaned['data'] ? cleaned['data'] : cleaned;
  }

  static async bDelete(endpoint) {
    const raw = await this.blockingRequest('DELETE', endpoint);
    let cleaned = DataUtils.obj2Camel(raw);
    return cleaned['data'] ? cleaned['data'] : cleaned;
  }

  static aFetch(endpoint, callback, errorCallback = null) {
    this.asyncRequest('GET', endpoint, null, callback, errorCallback);
  }

  static aPost(endpoint, body, callback, errorCallback = null) {
    this.asyncRequest('POST', endpoint, body, callback, errorCallback);
  }

  static aDelete(endpoint, callback, errorCallback = null) {
    this.asyncRequest('DELETE', endpoint, null, callback, errorCallback);
  }

  static async blockingRequest(method, endpoint, body) {
    const response = await fetch(this.url(endpoint), this.prepReq(method, body));
    return response.ok ? DataUtils.obj2Camel(await response.json()) : null;
  }

  static genHeaders(){
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  static prepReq(method = null, body = null) {
    body = body ? JSON.stringify(body) : null;
    const headers = this.genHeaders();
    return { method: method || 'GET', headers, body };
  }

   static asyncRequest(method, endpoint, body, callback, errorCallback = null) {
    fetch(this.url(endpoint), this.prepReq(method, body)).then(
      response =>
        response.json().then(data => {
          if (response.ok) {
            if (callback) callback(data);
            else return data;
          } else {
            if (errorCallback) {
              errorCallback &&
              errorCallback({
                kind: 'soft',
                error: data,
                status: response.status,
              });
            }
          }
        }),
      error => {
        const bundle = {
          kind: 'hard',
          error,
          status: error.status,
        };
        errorCallback && errorCallback(bundle);
      },
    );
  }
}
