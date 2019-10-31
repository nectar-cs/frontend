import Backend from "../../../utils/Backend";
import Job from "./Job";

export default class TarballJob extends Job {

  prepare(bundle){
    this.matchingId = bundle.matchingId;
  }

  async perform() {
    this.commence();
    const ep = `/microservices/${this.matchingId}/src_tarball`;
    const payload = {sha: this.gitCommit};
    this.tarBundle = await Backend.blockingPost(ep, payload);
    this.conclude(true);
  }

  getTarballUrl(){
    return this.tarBundle.tarballUrl;
  }

  progressItems() {
    return [
      this.buildProgressItem(
        "Repo",
        this.tarBundle ? 'cloned' : 'cloning',
        this.tarBundle ? 'done' : "working"
      )
    ]
  }

  hasSucceeded(){ return true; }
}