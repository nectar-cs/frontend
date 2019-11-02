import Kapi from "./Kapi";
import Backend from "./Backend";
import moment from "moment";
import Cookies from "js-cookie";

const KEY = "last_revision_check";
const THRESHOLD = { minutes: 1 };
const YEAR_2000 = "2000-01-01T00:00:00-00:00";

export default class RevisionChecker {

  async perform() {
    if (!this.shouldPerform()) return null;
    this.recordCheckTimestamp();
    const result = await this.fetchVerdict();
    return result['updateNecessary'] ? result : null;
  }

  async fetchVerdict(){
    const frontend = this.myVersion();
    const kapi = await this.fetchKapiVersion();
    const currentVersions = { frontend, kapi };
    const payload = { currentVersions };
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

  lastCheckTime(){
    const rawStamp = Cookies.get(KEY) || YEAR_2000;
    return moment(rawStamp);
  }

  furthestBackAcceptableCheckTime(){
    return moment().subtract(THRESHOLD);
  }

  wasLastCheckAgesAgo(){
    return this.lastCheckTime() < this.furthestBackAcceptableCheckTime();
  }

  isNonDevEnvironment(){
    const myEnv = process.env.NODE_ENV;
    return myEnv !== 'development';
    // return true;
  }
}