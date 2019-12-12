//@flow
import DataUtils from './DataUtils';
import type { Workspace } from '../types/Types';
import ForeignApi from "./ForeignApi";



export default class Kapi extends ForeignApi{

  static baseUrl(){
    return 'http://localhost:5000';
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
}
