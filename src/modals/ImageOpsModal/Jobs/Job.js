export default class Job {

  constructor(source){
    this.success = null;
    this.reason = null;
    this.started = false;
    this.updateCallback = source.updateCallback;
    this.progItemBuilder = source.progItemBuilder;
  }

  async perform(){
    this.commence();
    await this.initiateWork();
    while(!this.hasConcluded()){
      this.broadcastProgress();
      await this.recomputeStatus();
      await this.pollWait(this.hasConcluded())
    }
  }

  broadcastProgress(){
    this.updateCallback();
  }

  progressItems(){
    return [];
  }

  commence(){
    this.started = true;
  }

  conclude(success, reason = null){
    this.success = success;
    this.reason = reason;
  }

  supportsLogging() { return false; }
  logs() { return []; }
  hasStarted() { return this.started; }
  hasConcluded(){ return this.success != null }
  hasSucceeded(){ return this.hasConcluded() && this.success; }
  didFail(){ return this.hasConcluded() && !this.success; }
  getReason(){ return this.reason }

  async pollWait(antiCondition) {
    const ms = !antiCondition ?  Job.POLL_RATE : 0;
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async initiateWork(){ throw "Unimplemented!" }
  recomputeStatus(){ throw "Unimplemented!" }

  static POLL_RATE = 2000;
}