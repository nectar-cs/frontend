import PodJob from "./PodJob";

export default class PodScaleJob extends PodJob {

  prepare({scaleTo}){
    this.scaleTo = scaleTo;
  }

  toKapiPayload() {
    return {
      ...super.toKapiPayload(),
      scaleTo: this.scaleTo
    }
  }

  recomputeState() {
    if(this.runningPods().length === this.scaleTo)
      this.conclude(true);
  }

  deltaCount(){
    return this.scaleTo - this.initial.length;
  }

  progressItems(){
    const updatedCount = (this.updated || this.initial).length;
    const dCount = this.initial.length - updatedCount;
    const newPods = this.newPods();
    const running = this.runningPods(newPods);

    if(this.deltaCount() > 0){
      return [
        this.buildProgressItem(
          "New pods created",
          `${newPods.length}/${this.deltaCount()}`,
          newPods.length === this.deltaCount() ? 'done' : 'working'
        ),
        this.buildProgressItem(
          "New pods running",
          `${running.length}/${this.deltaCount()}`,
          running.length === this.deltaCount() ? 'done' : 'working'
        )
      ]
    } else {
      return [
        this.buildProgressItem(
          "Unwanted pods killed",
          `${dCount}/${-this.deltaCount()}`,
          dCount === -this.deltaCount()
        )
      ]
    }
  }

  kapiVerb() { return "scale_replicas"; }
}