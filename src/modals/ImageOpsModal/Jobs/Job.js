export default class Job {

  constructor(source){
    this.success = null;
    this.reason = null;
    this.started = false;
    this.progressCallback = source.progressCallback;
    this.buildProgressItem = source.buildProgressItem;
  }

  async perform(){
    // this.broadcastProgress();
    this.commence();
    await this.initiateWork();
    while(!this.hasConcluded()){
      await this.reloadData();
      this.recomputeState();
      // this.broadcastProgress();
      await this.pollWait(this.hasConcluded())
    }
    // this.broadcastProgress();
  }

  async pollWait(antiCondition) {
    const ms = !antiCondition ?  Job.POLL_RATE : 0;
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  broadcastProgress(){
    this.progressCallback();
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

  logs() { return []; }
  hasStarted() { return this.started; }
  hasConcluded(){ return this.success != null }
  hasSucceeded(){ return this.hasConcluded() && this.success; }
  hasFailed(){ return this.hasConcluded() && !this.success; }
  getReason(){ return this.reason }
  recomputeState(){ }

  async initiateWork(){ throw "Unimplemented!" }
  reloadData(){ throw "Unimplemented!" }

  static POLL_RATE = 2000;
}