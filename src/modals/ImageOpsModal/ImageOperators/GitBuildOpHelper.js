import ImageOperator, {sleep} from "./ImageOperator";
import Backend from "../../../utils/Backend";
import Kapi from "../../../utils/Kapi";
import DataUtils from "../../../utils/DataUtils";

const BUILD_FAIL = "failed";
const BUILD_PASS = "succeeded";
const DOCKER_OP_PULL_RATE = 2000;

export default class GitBuildOpHelper extends ImageOperator {

  constructor(bundle) {
    super(bundle);
    this.outImageName = bundle.outImageName;
    this.tarBundle = null;
    this.buildJob = null;
    this.pushJob = null;
  }

  async perform() {
    this.broadcastProgress();
    if(await this.fetchTarBundle()){
      if (await this.buildLoop()){
        if (await this.pushLoop())
          this.conclude(true);
        else
          this.conclude(false, 'Push Failed');
      } else {
        this.conclude(false, 'Build Failed');
      }
    }
  }

  async buildLoop(){
    this.broadcastProgress();
    await this.initiateBuild();
    this.broadcastProgress();

    while(!this.didJobFinish(this.buildJob)){
      await this.updateBuildStatus();
      this.broadcastProgress();
      await sleep(DOCKER_OP_PULL_RATE);
    }

    return this.didBuildSucceed();
  }

  async pushLoop(){
    this.broadcastProgress();
    await this.initiatePush();
    this.broadcastProgress();

    while(!this.didJobFinish(this.pushJob)){
      await this.updatePushStatus();
      this.broadcastProgress();
      await sleep(DOCKER_OP_PULL_RATE);
    }

    return this.didPushSucceed();
  }

  async updateBuildStatus() {
    this.buildJob = await this.fetchJobStatus(this.buildJob);
  }

  async updatePushStatus() {
    this.pushJob = await this.fetchJobStatus(this.pushJob);
  }

  async fetchJobStatus(job){
    const { jobType: type, jobId: id } = job;
    const ep = `/api/docker/${type}/${id}/job_info`;
    const result = await Kapi.blockingFetch(ep);
    const { logs, status } = result;
    return { ...job, logs, status };
  }

  async initiateBuild(){
    const ep = `/api/docker/build_image`;

    const payload = DataUtils.obj2Snake({
      repoTarUrl: this.tarBundle.tarballUrl,
      dockerfilePath: this.matching.dockerfilePath,
      outputImg: this.outImageName
    });

    this.buildJob = DataUtils.objKeysToCamel(
      await Kapi.blockingPost(ep, payload)
    );
  }

  async initiatePush(){
    const ep = `/api/docker/push_image`;

    const payload = DataUtils.obj2Snake({
      username: this.tarBundle.username,
      password: this.tarBundle.password,
      imageName: this.outImageName
    });

    console.log("PUSH BUN");
    console.log(payload);

    this.pushJob = DataUtils.objKeysToCamel(
      await Kapi.blockingPost(ep, payload)
    );

    console.log("PUYSH JOB FIRST");
    console.log(this.pushJob);
  }

  async fetchTarBundle() {
    this.broadcastProgress();
    const ep = `/microservices/${this.matching.id}/src_tarball`;
    const payload = {sha: this.gitCommit};
    this.tarBundle = await Backend.blockingPost(ep, payload);
    return true;
  }

  jobStatusStr(job){
    const raw = job && job.status;
    return raw && raw.toLowerCase();
  }

  didJobFinish(job){
    return [BUILD_PASS, BUILD_FAIL].includes(this.jobStatusStr(job));
  }

  didBuildSucceed(){ return this.jobStatusStr(this.buildJob) === BUILD_PASS; }
  didBuildFail(){ return this.jobStatusStr(this.buildJob) === BUILD_FAIL; }
  didPushSucceed(){ return this.jobStatusStr(this.pushJob) === BUILD_PASS; }
  didPushFail(){ return this.jobStatusStr(this.pushJob) === BUILD_FAIL; }

  hasTermOutput() { return true; }

  successMessage() {
    return "Image built, pushed, and set in pods";
  }

  isStableState(){
    if(this.tarBundle){
      return true;
    }
  }

  progressItems(){
    return [
      super.buildProgressItem(
        "Repo",
        this.tarBundle ? 'cloned' : 'cloning',
        this.cloneStatus()
      ),
      super.buildProgressItem(
        "Image",
        this.buildStatusFriendly(),
        this.jobChecklistStatus(this.buildJob),
      ),
      super.buildProgressItem(
        "Push",
        this.buildStatusFriendly(),
        this.jobChecklistStatus(this.pushJob),
      ),
    ]
  }

  terminalOutput(){
    let total  = [];
    if(this.buildJob && this.buildJob.logs){
      total = ['-----BUILD-----', ...this.buildJob.logs];
      if(this.pushJob && this.pushJob.logs){
        total = [...total, '-----PUSH-----', ...this.pushJob.logs];
      }
    }

    return total;
  }

  cloneStatus(){
    if(this.tarBundle) return 'done';
    return 'working';
  }

  jobChecklistStatus(job){
    if(job && job.jobId && job.status){
      if(this.didBuildSucceed()) return 'done';
      else if(this.didBuildFail()) return 'failed';
      else return "working";
    } else return null;
  }

  buildStatusFriendly(){
    const job = this.buildJob;
    if(job && job.jobId && job.status){
      if(this.didBuildSucceed()) return 'built';
      else if(this.didBuildFail()) return 'not built';
      else return "building";
    } else return 'N/A';
  }
}