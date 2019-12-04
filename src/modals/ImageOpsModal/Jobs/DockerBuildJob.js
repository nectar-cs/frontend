import DockerJob from './DockerJob';

export default class DockerBuildJob extends DockerJob {
  prepare(bundle) {
    this.tarballUrl = bundle.tarballUrl;
    this.dockerfilePath = bundle.dockerfilePath;
    this.dockerBuildPath = bundle.dockerBuildPath;
    this.outImageName = bundle.outImageName;
  }

  initiatePayload() {
    return {
      repoTarUrl: this.tarballUrl,
      dockerfilePath: this.dockerfilePath,
      dockerBuildPath: this.dockerBuildPath,
      outputImg: this.outImageName,
    };
  }

  initiatePath() {
    return `/api/docker/build_image`;
  }
}
