import Kapi from "./Kapi";
import Backend from "./Backend";
import moment from "moment";
import Cookies from "js-cookie";

const KEY = "last_revision_check";
const THRESHOLD = { minutes: 0 };
const YEAR_2000 = "2000-01-01T00:00:00-00:00";

export default class RevisionChecker {

  async perform() {
    if (!this.shouldPerform()) return null;
    this.recordCheckTimestamp();
    return await this.fetchVerdict();
  }

  async fetchVerdict(){
    const payload = {
      frontend: this.myVersion(),
      kapi: await this.fetchKapiVersion()
    };

    const ep = '/revisions/compare';
    return await Backend.blockingPost(ep, payload);
  }

  async fetchKapiVersion(){
    const ep = '/api/status/revision';
    return (await Kapi.blockingFetch(ep))['sha'];
  }

  myVersion(){
    try{
      return REVISION;
    } catch {
      //TODO sentry
      return '';
    }
  }

  shouldPerform(){
    const nonDev = this.isNonDevEnvironment();
    const lastCheckOutdated = this.wasLastCheckAgesAgo();
    return nonDev && lastCheckOutdated;
  }

  recordCheckTimestamp(){
    const nowISOStr = moment().format();
    Cookies.set(KEY, nowISOStr);
  }

  wasLastCheckAgesAgo(){
    const minAcceptableTime = moment().subtract(THRESHOLD);
    const rawStamp = Cookies.get(KEY) || YEAR_2000;
    const lastCheck = moment(rawStamp);
    return lastCheck < minAcceptableTime;
  }

  isNonDevEnvironment(){
    // const myEnv = process.env.NODE_ENV;
    // return myEnv !== 'development';
    return true;
  }
}