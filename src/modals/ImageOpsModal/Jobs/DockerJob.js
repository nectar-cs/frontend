import DataUtils from "../../../utils/DataUtils";
import Kapi from "../../../utils/Kapi";
import Job from "./Job";

export default class DockerJob extends Job {

  static KAPI_STATUS_FAIL = "failed";
  static KAPI_STATUS_PASS = "succeeded";
  static END_STATES = [
    DockerJob.KAPI_STATUS_FAIL,
    DockerJob.KAPI_STATUS_PASS
  ];

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

  recomputeState(){
    const endStates = DockerJob.END_STATES;
    if(endStates.includes(this.jobStatusStr())){
      console.log("END STATE REACHED " + this.jobStatusStr());
      this.success = this.jobStatusStr() === DockerJob.KAPI_STATUS_PASS;
    }
  }

  async reloadData(){
    const { type, id } = this.job;
    const ep = `/api/docker/${type}/${id}/job_info`;
    const result = await Kapi.blockingFetch(ep);
    const { logs, status } = result;
    this.job = { ...this.job, logs, status };
  }

  jobStatusStr(){
    const raw = this.job.status;
    return raw && raw.toLowerCase();
  }

  logs(){ return this.job.logs }
  initiatePayload(){}
  initiatePath(){}
}