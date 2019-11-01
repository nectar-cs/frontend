import BaseOperator from "./BaseOperator";
import ChangeImageTagJob from "../Jobs/ChangeImageTagJob";

export default class ChangeImageTagOperator extends BaseOperator {

  constructor(props) {
    super(props);
    this.imageName = props.imageName;
  }

  successMessage() {
    return "All pods running the new image.";
  }

  prepareJob(instance) {
    super.prepareJob({imageName: this.imageName});
  }

  jobClasses() {
    return [ChangeImageTagJob];
  }
}