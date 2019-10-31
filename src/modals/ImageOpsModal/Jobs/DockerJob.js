import DataUtils from "../../../utils/DataUtils";
import Kapi from "../../../utils/Kapi";
import Job from "./Job";

export default class DockerJob extends Job {

  static BUILD_FAIL = "failed";
  static BUILD_PASS = "succeeded";
  static END_STATES = [DockerJob.BUILD_FAIL, DockerJob.BUILD_PASS];

  constructor(args) {
    super(args);
    this.job = {};
  }

  async initiateWork() {
    const { jobId: id, jobType: type } = DataUtils.obj2Camel(
      await Kapi.blockingPost(
        this.initiatePath(),
        this.initiatePayload()
      )
    );

    this.job = { id, type };
  }

  hasConcluded(){
    const endStates = DockerJob.END_STATES;
    return endStates.includes(this.jobStatusStr());
  }

  async recomputeStatus(){
    const { jobType: type, jobId: id } = this.job;
    const ep = `/api/docker/${type}/${id}/job_info`;
    const result = await Kapi.blockingFetch(ep);
    const { logs, status } = result;
    this.job = { ...this.job, logs, status };
  }

  jobStatusStr(){
    const raw = this.job && this.job.status;
    return raw && raw.toLowerCase();
  }

  logs(){ return this.job.logs }
  supportsLogging() { return true; }

  initiatePayload(){}
  initiatePath(){}
}