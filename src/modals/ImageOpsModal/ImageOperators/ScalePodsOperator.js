import ScalePodsJob from '../Jobs/ScalePodsJob';
import BaseOperator from './BaseOperator';

export default class ScalePodsOperator extends BaseOperator {
  constructor(bundle) {
    super(bundle);
    // eslint-disable-next-line radix
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
