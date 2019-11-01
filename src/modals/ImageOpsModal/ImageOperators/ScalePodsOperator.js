import BaseOperator from "./BaseOperator";
import PodScaleJob from "../Jobs/PodScaleJob";

export default class ScalePodsOperator extends BaseOperator {

  constructor(bundle) {
    super(bundle);
    this.scaleTo = parseInt(bundle.scaleTo);
  }

  prepareJob(instance) {
    instance.prepare({scaleTo: this.scaleTo})
  }

  successMessage() {
    return "Pods count changed to required amount";
  }

  jobClasses(){
    return [ PodScaleJob ];
  }
}