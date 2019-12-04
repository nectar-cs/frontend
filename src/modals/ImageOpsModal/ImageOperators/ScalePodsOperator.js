import BaseOperator from './BaseOperator';
import ScalePodsJob from '../Jobs/ScalePodsJob';

export default class ScalePodsOperator extends BaseOperator {
  constructor(bundle) {
    super(bundle);
    this.scaleTo = parseInt(bundle.scaleTo);
  }

  prepareJob(instance) {
    instance.prepare({
      scaleTo: this.scaleTo,
      deployment: this.deployment,
    });
  }

  successMessage() {
    return 'Pods count changed to required amount';
  }

  jobClasses() {
    return [ScalePodsJob];
  }
}
