import Backend from "../../../utils/Backend";
import Job from "./Job";

export default class TarballJob extends Job {

  prepare(bundle){
    this.matchingId = bundle.matchingId;
  }

  async perform() {
    this.commence();
    this.broadcastProgress();
    const ep = `/microservices/${this.matchingId}/src_tarball`;
    const payload = {sha: this.gitCommit};
    this.tarBundle = await Backend.blockingPost(ep, payload);
    this.broadcastProgress();
    this.conclude(true);
  }

  getTarballUrl(){
    return this.tarBundle.tarballUrl;
  }

  getCredentials() {
    const {username, password} = this.tarBundle;
    return { username, password };
  }

  progressItems() {
    return [
      this.buildProgressItem(
        "Repo",
        this.simpleDetail(this.tarBundle ? 'Cloned' : 'Cloning'),
        this.simpleStatus(this.tarBundle ? 'done' : "working")
      )
    ]
  }

  hasSucceeded(){ return true; }
}