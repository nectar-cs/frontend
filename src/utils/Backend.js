import Cookies from 'js-cookie';
import ForeignApi from "./ForeignApi";

export default class Backend extends ForeignApi{
  static baseUrl() { return 'http://localhost:3000'; }
}
