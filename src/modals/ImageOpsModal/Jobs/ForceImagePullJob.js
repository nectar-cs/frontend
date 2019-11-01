import PodJob from "./PodJob";

export default class ForceImagePullJob extends PodJob {

  recomputeState() {
    const isStable = this.arePodsInState(
      this.newPods(),
      this.initial.length,
      p => p.state.toLowerCase(),
      'running'
    );

    if(isStable)
      this.conclude(isStable);
  }

  progressItems(){
    const [_new, dead] = [this.newPods(), this.deadPods()];
    const running = this.runningPods(_new);

    return [
      super.buildProgressItem(
        "Old pods gone",
        `${dead.length}/${this.initial.length}`,
        dead.length === this.initial.length
      ),
      super.buildProgressItem(
        "New pods running",
        `${running.length}/${this.initial.length}`,
        running.length === this.initial.length
      ),
    ];
  }

  kapiVerb() { return "image_reload"; }
}