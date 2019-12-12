import Cookies from 'js-cookie';
import DataUtils from './DataUtils';
import ForeignApi from "./ForeignApi";

export default class Backend extends ForeignApi{

  static baseUrl() { return 'http://localhost:3000'; }

  static kvGet(key) {
    return Cookies.get(key);
  }

  static kvSet(key, value) {
    return Cookies.set(key, value);
  }
}
