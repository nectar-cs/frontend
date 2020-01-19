import Kapi from './Kapi';
import Central from './Central';
import moment from 'moment';
import Cookies from 'js-cookie';
import Utils from './Utils';
import Backend from "./Backend";

const KEY = 'last_revision_check';
const THRESHOLD = { minutes: 10 };
const YEAR_2000 = '2000-01-01T00:00:00-00:00';

export default class UpdateChecker {
  async perform() {
    if (!this.shouldPerform()) return null;
    this.recordCheckTimestamp();
    return await this.fetchVerdict();
  }

  async fetchVerdict() {
    const frontend = Utils.REVISION;
    const kapi = await this.fetchKapiVersion();
    const backend = await this.fetchBackendVersion();
    const currentVersions = { frontend, kapi, backend };
    const payload = { currentVersions };
    const ep = '/revisions/compare';
    const statuses = await Central.bPost(ep, payload);
    const needingUpdate = (statuses || []).filter(v => v.updateNecessary);
    return needingUpdate.length > 0;
  }

  async fetchKapiVersion() {
    const ep = '/api/status/revision';
    return (await Kapi.bFetch(ep))['sha'];
  }

  async fetchBackendVersion(){
    const ep = '/status/revision';
    return (await Backend.bFetch(ep))['sha'];
  }

  shouldPerform() {
    const nonDev = Utils.isNonDev();
    const lastCheckOutdated = this.wasLastCheckTooLongAgo();
    return nonDev && lastCheckOutdated;
  }

  recordCheckTimestamp() {
    const nowISOStr = moment()
      .utc()
      .format();
    Cookies.set(KEY, nowISOStr);
  }

  lastCheckTime() {
    const rawStamp = Cookies.get(KEY) || YEAR_2000;
    return moment(rawStamp).utc();
  }

  furthestBackAcceptableCheckTime() {
    return moment()
      .utc()
      .subtract(THRESHOLD)
      .utc();
  }

  wasLastCheckTooLongAgo() {
    const lastTime = this.lastCheckTime();
    const deadline = this.furthestBackAcceptableCheckTime();
    return lastTime.isBefore(deadline);
  }
}
