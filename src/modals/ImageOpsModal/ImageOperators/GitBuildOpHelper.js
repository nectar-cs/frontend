import ImageOperator, {sleep} from "./ImageOperator";
import Backend from "../../../utils/Backend";
import Kapi from "../../../utils/Kapi";
import DataUtils from "../../../utils/DataUtils";

const BUILD_FAIL = "failed";
const BUILD_PASS = "succeeded";

export default class GitBuildOpHelper extends ImageOperator {

  constructor(bundle) {
    super(bundle);
    this.outImageName = bundle.outImageName;
    this.tarBundle = null;
    this.buildJob = null;
    this.failureReason = '';
  }

  async perform(){
    this.broadcastProgress();
    await this.fetchTarBundle();

    this.broadcastProgress();
    await this.buildLoop();

    if(this.didBuildSucceed()){
      this.broadcastProgress();
      this.conclude(true);
    } else {
      this.failureReason = 'Build Failed';
      this.conclude(false);
    }

    this.broadcastProgress();
  }

  async buildLoop(){
    await this.initiateBuild();
    this.broadcastProgress();

    while(!this.didBuildFinish()){
      await sleep(2000);
      await this.checkBuildStatus();
      this.broadcastProgress();
    }
  }

  async checkBuildStatus(){
    const { jobType: type, jobId: id } = this.buildJob;
    const ep = `/api/docker/${type}/${id}/job_info`;
    const result = await Kapi.blockingFetch(ep);
    const { logs, status } = result;
    this.buildJob = { ...this.buildJob, logs, status };
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

  async fetchTarBundle() {
    const ep = `/microservices/${this.matching.id}/src_tarball`;
    const payload = {sha: this.gitCommit};
    this.tarBundle = await Backend.blockingPost(ep, payload);
  }

  buildStatusStr(){
    const raw = this.buildJob && this.buildJob.status;
    return raw && raw.toLowerCase();
  }

  didBuildFinish(){
    console.log("NOW BUILD STR IS " + this.buildStatusStr());
    return [BUILD_PASS, BUILD_FAIL].includes(this.buildStatusStr());
  }

  didBuildSucceed(){ return this.buildStatusStr() === BUILD_PASS; }
  didBuildFail(){ return this.buildStatusStr() === BUILD_FAIL; }

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
        this.buildStatus(),
      ),
    ]
  }

  terminalOutput(){
    if(this.buildJob && this.buildJob.logs){
      return this.buildJob.logs;
    } else return [];
  }

  cloneStatus(){
    if(this.tarBundle) return 'done';
    return 'working';
  }

  buildStatus(){
    const job = this.buildJob;
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

  failureMessage() {
    return this.failureReason;
  }
}