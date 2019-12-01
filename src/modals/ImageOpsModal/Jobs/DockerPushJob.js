import DockerJob from './DockerJob';

export default class DockerPushJob extends DockerJob {
  prepare(bundle) {
    this.username = bundle.username;
    this.password = bundle.password;
    this.imageName = bundle.imageName;
  }

  initiatePayload() {
    const { username, password, imageName } = this;
    return { username, password, imageName };
  }

  initiatePath() {
    return `/api/docker/push_image`;
  }
}
