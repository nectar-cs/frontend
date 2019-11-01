import Job from "./Job";
import Kapi from "../../../utils/Kapi";

export default class AnnotateDeploymentJob extends Job {

  prepare({sha, message, branch}){

  }

  async initiateWork() {
    const ep = `/api/run/git_annotate`;
    const payload = {  };
    await Kapi.blockingPost()
  }

  perform(){
    this.commence();
    this.conclude();
  }

}