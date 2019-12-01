import Job from './Job';
import Kapi from '../../../utils/Kapi';

export default class AnnotateDeploymentJob extends Job {
  prepare(bundle) {
    super.prepare(bundle);
    this.deployment = bundle.deployment;
    this.commitSha = bundle.commitSha;
    this.commitMessage = bundle.commitMessage;
    this.commitBranch = bundle.commitBranch;
  }

  async submitAnnotateRequest() {
    const { name, namespace } = this.deployment;
    const ep = `/api/deployments/${namespace}/${name}/annotate_git`;
    const payload = {
      sha: this.commitSha,
      message: this.commitMessage,
      branch: this.commitBranch,
    };
    this.result = await Kapi.bPost(ep, payload);
  }

  async perform() {
    this.commence();
    await this.submitAnnotateRequest();
    this.broadcastProgress();
    this.conclude();
  }

  progressItems() {
    return [
      this.buildProgressItem(
        'Commit Annotations',
        this.simpleDetail(this.result ? 'Patched' : 'Patching'),
        this.simpleStatus(this.result ? 'done' : 'working'),
      ),
    ];
  }

  hasSucceeded() {
    return true;
  }
}
