import BaseOperator from './BaseOperator';
import ForceImagePullJob from '../Jobs/ForceImagePullJob';

export default class ForceImagePullOperator extends BaseOperator {
  successMessage() {
    return 'All pods running the old image have been replaced.';
  }

  prepareJob(instance) {
    instance.prepare({ deployment: this.deployment });
  }

  jobClasses() {
    return [ForceImagePullJob];
  }
}
