import ImageOperator from "./ImageOperator";
import DataUtils from "../../../utils/DataUtils";

export default class ScalePodsOperator extends ImageOperator {

  constructor(bundle) {
    super(bundle);
    this.scaleTo = parseInt(bundle.scaleTo);
  }

  imageOperationVerb(){
    return "scale_replicas";
  }

  imageOperationPayload(){
    return DataUtils.obj2Snake({
      ...super.imageOperationPayload(),
      scaleTo: this.scaleTo
    });
  }

  successMessage() {
    return "Pods scaled to required amount and are running.";
  }

  isCrashedState(){
    return { isCrashed: false, reason: "lolz" };
  }

  enrichPod(pod){
    return {...pod, desiredState: 'running'};
  }

  isStableState(){
    return super.checkGroupInState(
      this.updated,
      this.scaleTo,
      p => p.state.toLowerCase(),
      'running'
    );
  }

  buildPodList(){
    if(this.updated) {
      return this.updated.map(p => this.enrichPod(p));
    } else return super.buildSimplePodList();
  }

  delta(){
    return this.scaleTo - this.initial.length;
  }

  progressItems(){
    const updatedCount = (this.updated || this.initial).length;
    const dCount = this.initial.length - updatedCount;
    const newPods = this.strictlyNewPods();
    const running = this.runningPods(newPods);

    if(this.delta() > 0){
      return [
        super.buildProgressItem(
          "New pods created",
          `${newPods.length}/${this.delta()}`,
          newPods.length === this.delta()
        ),
        super.buildProgressItem(
          "New pods running",
          `${running.length}/${this.delta()}`,
          running.length === this.delta()
        )
      ]
    } else {
      return [
        super.buildProgressItem(
          "Unwanted pods killed",
          `${dCount}/${-this.delta()}`,
          dCount === -this.delta()
        )
      ]
    }
  }
}