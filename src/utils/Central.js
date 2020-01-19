import ForeignApi from "./ForeignApi";
import Utils from "./Utils";

export default class Central extends ForeignApi{
  static baseUrl() {
    if(Utils.isNonDev())
      return "https://mosaic-central.herokuapp.com";
    else return 'http://localhost:3001';
  }
}
