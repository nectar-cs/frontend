import Utils from "../../utils/Utils";

const APPS = ['frontend', 'kapi'];

export default class Helper {
  static massageStatuses(statuses){
    if(this.isResultOk(statuses)){
      return statuses;
    } else {
      Utils.senTrack("Bad statuses for revision");
      return this.genFallbackStatuses();
    }
  }

  static genFallbackStatuses(){
    return APPS.map(appName => (
      { appName: appName, updateNecessary: false }
    ));
  }

  static isResultOk(statuses){
    try{
      const appNames = statuses.map(s => s.appName);
      return APPS.every(e => appNames.includes(e));
    } catch(e) {
      return false;
    }
  }

  static computeDefaultChecks(versions){
    return Object.keys(versions).reduce((h, k) => (
      { ...h, [versions[k].appName]: versions[k].updateNecessary }
    ), {});
  }
}
