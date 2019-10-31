export const DOCKER_OP_PULL_RATE = 2000;

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class BaseOperator {

  constructor(bundle){
    const jobClasses = this.constructor.jobClasses();
    this.jobs = jobClasses.map(c => this.initializeJob(c));

    this.conclusion = null;
    this.progressCallback = bundle.progressCallback;
    this.finishedCallback = bundle.finishedCallback;

    this.deployment = bundle.deployment;
    this.matching = bundle.matching;

    this.broadcastProgress = this.broadcastProgress.bind(this);
    this.buildProgressItem = this.buildProgressItem.bind(this);
  }

  initializeJob(JobClass){
    return new JobClass({
      progressCallback: this.broadcastProgress,
      buildProgressItem: this.buildProgressItem
    })
  }

  async perform(){
    for (const job of this.jobs){
      this.prepare(job);
      await job.perform();
      if(job.hasSucceeded()){
        console.log("JOB SUCCEEDED, CONTINUE");
      } else {
        console.log("JOB FAILED");
        this.conclude(false, job.getReason());
        return;
      }
    }
    this.conclude(true);
  }

  jobLogs(){
    return this.runningOrFinishedJobs().reduce((all, job) => (
      [...all, ...job.logs()]
    ), []);
  }

  runningOrFinishedJobs(){
    return this.jobs.filter(job =>
      job.hasStarted() || job.hasConcluded()
    )
  }

  getJob(klass){
    return this.jobs.find(job => (
      job.constructor.name === klass.name
    ))
  }

  progressItems() {
    return this.jobs.reduce((all, crt) => (
      [...all, ...crt.progressItems()]
    ), []);
  }

  broadcastProgress(){
    this.progressCallback([])
  }

  progressItemStatus(status){
    if(status === 'done') return status;
    if(this.conclusion !== null)
      return this.conclusion ? 'done' : 'failed';
    else return status;
  }

  buildProgressItem(title, detail, status){
    return({
      name: title,
      detail: detail,
      status: this.progressItemStatus(status)
    })
  }

  conclusionMessage(){
    if(this.conclusion)
      return this.successMessage();
    else return this.failureMessage();
  }

  failureMessage() {
    return this.failureReason;
  }

  conclude(success, reason = null){
    this.conclusion = success;
    this.failureReason = reason;
    this.finishedCallback(success);
  }

  supportsLogging() { return false; }
  prepare(instance){}
  successMessage(){ throw `Method successMessage not implemented!`; }

  static jobClasses() { return []; }
}