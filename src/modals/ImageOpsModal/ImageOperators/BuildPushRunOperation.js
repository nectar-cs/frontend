import BaseOperator, {DOCKER_OP_PULL_RATE, sleep} from "./BaseOperator";
import Backend from "../../../utils/Backend";
import Kapi from "../../../utils/Kapi";
import DataUtils from "../../../utils/DataUtils";
import TarballJob from "../Jobs/TarballJob";
import DockerBuildJob from "../Jobs/DockerBuildJob";
import DockerPushJob from "../Jobs/DockerPushJob";

export default class BuildPushRunOperation extends BaseOperator {

  static jobClasses(){
    return [
      TarballJob,
      DockerBuildJob,
      DockerPushJob
    ]
  }

  constructor(bundle) {
    super(bundle);
    this.outImageName = bundle.outImageName;
    this.gitCommit = bundle.gitCommit;
  }

  prepare(instance) {
    console.log("OFFERING PREPARE " + instance.constructor.name);

    if (instance instanceof TarballJob)
      this.prepareTarballJob(instance);

    if (instance instanceof DockerBuildJob)
      this.prepareBuildJob(instance);

    if (instance instanceof DockerPushJob)
      this.preparePushJob(instance);
  }

  prepareTarballJob(instance){
    instance.prepare({
      matchingId: this.matching.id
    })
  }

  prepareBuildJob(instance){
    console.log("PREPARING " + instance.constructor.name);
    const cloneJob = this.getJob(TarballJob);
    console.log(cloneJob.getTarballUrl());
    console.log(this.matching);
    console.log(this.outImageName);

    instance.prepare({
      tarballUrl: cloneJob.getTarballUrl(),
      dockerfilePath: this.matching.dockerfilePath,
      outImageName: this.outImageName
    })
  }

  preparePushJob(instance){
    const cloneJob = this.getJob(TarballJob);
    instance.prepare({
      username: cloneJob.getTarballUrl(),
      password: this.matching.dockerfilePath,
      imageName: this.outImageName
    })
  }

  progressItems(){
    const cloneJob = this.getJob(TarballJob);
    return [
      ...cloneJob.progressItems(),
      super.buildProgressItem(
        "Image Build & Push",
        this.imageStatusFriendly(),
        this.imageChecklistStatus(),
      ),
    ]
  }

  imageChecklistStatus() {
    const {buildJob: build} = this;
    if (build) return "working";
  }

  imageStatusFriendly() {
    const build = this.getJob(DockerBuildJob);
    const push = this.getJob(DockerPushJob);

    if (build.hasStarted()) {
      if (push.hasStarted()) {
        if (push.didSucceed()) return 'Pushed';
        else if (push.didFail()) return 'Push Failed';
        else return "Pushing";
      } else {
        if (build.didSucceed()) return 'Pushed';
        else if (build.didFail()) return 'Push Failed';
        else return "Building";
      }
    } else return "N/A";
  }

  supportsLogging() { return true; }
}