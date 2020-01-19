import Cookies from 'js-cookie';
import ForeignApi from "./ForeignApi";
import Utils from "./Utils";

export default class Backend extends ForeignApi{
  static baseUrl() {
    if(Utils.isNonDev())
      return "https://mosaic-central.herokuapp.com";
    else return 'http://localhost:3001';
  }
}
