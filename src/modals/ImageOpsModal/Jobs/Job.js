export default class Job {
  constructor(source) {
    this.success = null;
    this.reason = null;
    this.started = false;
    this.progressCallback = source.progressCallback;
    this.buildProgressItem = source.buildProgressItem;
  }

  async perform() {
    this.commence();
    this.broadcastProgress();
    await this.initiateWork();
    this.broadcastProgress();

    do {
      // eslint-disable-next-line no-await-in-loop
      await this.reloadData();
      this.recomputeState();
      this.broadcastProgress();
      // eslint-disable-next-line no-await-in-loop
      await this.pollWait(this.hasConcluded());
    } while (!this.hasConcluded());
  }

  async pollWait(antiCondition) {
    const ms = !antiCondition ? Job.POLL_RATE : 0;
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  broadcastProgress() {
    this.progressCallback();
  }

  conclude(success, reason = null) {
    this.success = success;
    this.reason = reason;
  }

  simpleStatus(predicate) {
    if (!this.hasStarted()) return null;
    if (predicate) return 'done';
    return 'working';
  }

  simpleDetail(detail) {
    if (this.hasStarted()) return detail;
    return '';
  }

  logs() {
    return [];
  }

  hasStarted() {
    return this.started;
  }

  hasConcluded() {
    return this.success != null;
  }

  hasSucceeded() {
    return this.hasConcluded() && this.success;
  }

  hasFailed() {
    return this.hasConcluded() && !this.success;
  }

  getReason() {
    return this.reason;
  }

  recomputeState() {}

  commence() {
    this.started = true;
  }

  progressItems() {
    return [];
  }

  async initiateWork() {
    // eslint-disable-next-line no-throw-literal
    throw 'Unimplemented!';
  }

  reloadData() {
    // eslint-disable-next-line no-throw-literal
    throw 'Unimplemented!';
  }

  prepare() {}

  static POLL_RATE = 1200;
}
