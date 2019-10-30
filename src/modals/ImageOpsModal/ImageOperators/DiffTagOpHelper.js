import ImageOperator from "./ImageOperator";
import DataUtils from "../../../utils/DataUtils";

export default class DiffTagOpHelper extends ImageOperator {

  successMessage() {
    return "All pods running the new image.";
  }

  imageOperationPayload(){
    return DataUtils.obj2Snake({
      ...super.imageOperationPayload(),
      targetName: this.imageName
    })
  }

  enrichPod(pod){
    return {...pod, desiredImage: this.targetImage};
  }

  readyPods(){
    if(!this.updated) return [];
    const patched = super.podsWithImage(this.updated, this.targetImage);
    return super.runningPods(patched);
  }

  isStableState(){
    return this.readyPods().length === this.initial.length;
  }

  buildPodList(){
    if(this.updated) {
      return this.updated.map(p => this.enrichPod(p));
    } else return super.buildSimplePodList();
  }

  progressItems(){
    const patched = this.readyPods();
    return [
      super.buildProgressItem(
        "Pods running new image",
        `${patched.length}/${this.initial.length}`,
        patched.length === this.initial.length
      )
    ]
  }
}