//@flow
import DataUtils from './DataUtils';
import type { Workspace } from '../types/Types';

export default class Kapi {
  static baseUrl() {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:5000';
    } else {
      return 'http://localhost:5000';
    }
  }

  static workspaceToFilterUrlParams(w: Workspace): string {
    const { nsFilterType, nsFilters, lbFilterType, lbFilters } = w;
    const valueTransformed = {
      nsFilterType,
      lbFilterType,
      nsFilters: nsFilters.join(','),
      lbFilters: lbFilters.join(','),
    };

    const eqStrings = Object.keys(valueTransformed).map(key => {
      const newKey = DataUtils.camelStringToSnake(key);
      const value = valueTransformed[key];
      return `${newKey}=${value}`;
    });

    return eqStrings.join('&');
  }

  static filterFetch(endpoint, ws, callback, errorCallback = null) {
    const args = this.workspaceToFilterUrlParams(ws);
    endpoint = `${endpoint}?${args}&pods=true&svcs=true`;
    this.fetch(endpoint, callback, errorCallback);
  }

  static fetch(endpoint, callback, errorCallback = null) {
    this.raisingRequest('GET', endpoint, null, callback, errorCallback);
  }

  static post(endpoint, body, callback, errorCallback = null) {
    this.raisingRequest('POST', endpoint, body, callback, errorCallback);
  }

  static prepReq(method = null, body = null) {
    body = body ? JSON.stringify(body) : null;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    return { method: method || 'GET', headers, body };
  }

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
    return await this.blockingRequest('POST', endpoint, payload);
  }

  static async blockingRequest(method, endpoint, body) {
    const response = await fetch(this.url(endpoint), this.prepReq(method, body));
    return response.ok ? DataUtils.obj2Camel(await response.json()) : null;
  }

  static raisingRequest(method, endpoint, body, callback, errorCallback = null) {
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
