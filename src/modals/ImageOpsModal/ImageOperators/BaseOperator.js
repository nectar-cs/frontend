export default class BaseOperator {

  constructor(bundle){
    const jobClasses = this.jobClasses(bundle);
    this.jobs = jobClasses.map(c => this.initializeJob(c));

    this.conclusion = null;
    this.notifyUpdated = (x) => bundle.notifyUpdated(x);
    this.notifyFinished = (x) => bundle.notifyFinished(x);

    this.deployment = bundle.deployment;
    this.matching = bundle.matching;
  }

  async perform(){
    for (const job of this.jobs){
      this.prepareJob(job);
      await job.perform();
      this.broadcastProgress();
      if (!job.hasSucceeded()) {
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
    this.notifyUpdated(this.progressItems())
  }

  progressItemStatus(status){
    if(status === 'failed') return 'failed';
    if(this.conclusion != null)
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
    this.notifyFinished(success);
  }

  initializeJob(JobClass){
    return new JobClass({
      progressCallback: (...x) =>  this.broadcastProgress(...x),
      buildProgressItem: (...x) => this.buildProgressItem(...x)
    })
  }

  supportsLogging() { return false; }
  prepareJob(instance){}
  successMessage(){ throw `Method successMessage not implemented!`; }

  jobClasses() { return []; }
}