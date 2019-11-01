import BaseOperator from "./BaseOperator";
import TarballJob from "../Jobs/TarballJob";
import DockerBuildJob from "../Jobs/DockerBuildJob";
import DockerPushJob from "../Jobs/DockerPushJob";
import ForceImagePullJob from "../Jobs/ForceImagePullJob";
import ChangeImageTagJob from "../Jobs/ChangeImageTagJob";
import AnnotateDeploymentJob from "../Jobs/AnnotateDeploymentJob";

export default class BuildPushRunOperation extends BaseOperator {

  constructor(bundle) {
    super(bundle);
    this.outImageName = bundle.outImageName;
    this.gitCommit = bundle.gitCommit;
  }

  prepareJob(instance) {
    if (instance instanceof TarballJob)
      this.prepareTarballJob(instance);

    if (instance instanceof DockerBuildJob)
      this.prepareBuildJob(instance);

    if (instance instanceof DockerPushJob)
      this.preparePushJob(instance);

    if(instance instanceof ChangeImageTagJob)
      this.prepareTagChangeJob(instance);
  }

  prepareTagChangeJob(instance){
    instance.prepare({
      imageName: this.outImageName
    })
  }

  prepareTarballJob(instance){
    instance.prepare({
      matchingId: this.matching.id
    })
  }

  prepareBuildJob(instance){
    const tarJob = this.getJob(TarballJob);

    instance.prepare({
      tarballUrl: tarJob.getTarballUrl(),
      dockerfilePath: this.matching.dockerfilePath,
      outImageName: this.outImageName
    })
  }

  preparePushJob(instance){
    const tarJob = this.getJob(TarballJob);
    instance.prepare({
      imageName: this.outImageName,
      ...tarJob.getCredentials()
    })
  }

  progressItems(){
    const tarJob = this.getJob(TarballJob);
    const podJob = this.jobs[-1];
    return [
      ...tarJob.progressItems(),
      this.phaseTwoProgressItem(),
      ...podJob.progressItems()
    ];
  }

  phaseTwoProgressItem(){
    return this.buildProgressItem(
      "Image Build & Push",
      this.imageStatusFriendly(),
      this.imageChecklistStatus(),
    )
  }

  imageChecklistStatus() {
    const build = this.getJob(DockerBuildJob);
    const push = this.getJob(DockerPushJob);
    if(push.hasSucceeded()) return "done";
    if(push.hasFailed() || build.hasFailed()) return "failed";
    return build.hasStarted() ? "working" : null;
  }

  imageStatusFriendly() {
    const build = this.getJob(DockerBuildJob);
    const push = this.getJob(DockerPushJob);

    if (build.hasStarted()) {
      if (push.hasStarted()) {
        if (push.hasSucceeded()) return 'Pushed';
        else if (push.hasFailed()) return 'Push Failed';
        else return "Pushing";
      } else {
        if (build.hasSucceeded()) return 'Built';
        else if (build.hasFailed()) return 'Build Failed';
        else return "Building";
      }
    } else return "N/A";
  }

  successMessage() {
    const verb = `${this.isSameImage() ? "Recreate" : "Retag"} Pods`;
    return `Clone -> Build -> Push -> ${verb} -> Annotate`;
  }

  supportsLogging() {
    return true;
  }

  isSameImage(){
    const { deployment, outImageName } = this;
    return outImageName === deployment.imageName;
  }

  jobClasses(){
    const same = this.isSameImage();
    const PodJob = same ? ForceImagePullJob : ChangeImageTagJob;

    return [
      TarballJob,
      DockerBuildJob,
      DockerPushJob,
      PodJob,
      AnnotateDeploymentJob
    ]
  }
}