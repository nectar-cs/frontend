import DataUtils from '../../../utils/DataUtils';
import Kapi from '../../../utils/Kapi';
import Job from './Job';

export default class DockerJob extends Job {
  constructor(args) {
    super(args);
    this.job = { id: null, type: null, logs: [], status: '' };
  }

  async initiateWork() {
    const { jobId: id, jobType: type } = DataUtils.obj2Camel(
      await Kapi.bPost(this.initiatePath(), this.initiatePayload()),
    );
    this.job = { ...this.job, id, type };
  }

  conclude(...args) {
    super.conclude(...args);
    this.requestCleanup();
  }

  recomputeState() {
    const endStates = DockerJob.END_STATES;
    if (endStates.includes(this.status())) {
      const win = this.status() === DockerJob.KAPI_STATUS_PASS;
      this.conclude(win, 'IDK');
    }
  }

  async reloadData() {
    const { type, id } = this.job;
    const ep = `/api/docker/${type}/${id}/job_info`;
    const result = await Kapi.bFetch(ep);
    const { logs, status } = result;
    this.job = { ...this.job, logs, status };
  }

  requestCleanup() {
    const { type, id } = this.job;
    const ep = `/api/docker/${type}/${id}/clear_job`;
    Kapi.post(ep, {}, null);
  }

  status() {
    return this.job.status.toLowerCase();
  }
  logs() {
    return this.job.logs || [];
  }
  initiatePayload() {}
  initiatePath() {}

  static KAPI_STATUS_FAIL = 'failed';
  static KAPI_STATUS_PASS = 'succeeded';
  static END_STATES = [DockerJob.KAPI_STATUS_FAIL, DockerJob.KAPI_STATUS_PASS];
}
