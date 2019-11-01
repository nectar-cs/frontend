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
    const [_new, dead] = [this.newPods(), this.newPods()];
    const [initial, running] = [this.initial, this.runningPods(_new)];

    return [
      super.buildProgressItem(
        "Old pods gone",
        `${dead.length}/${initial.length}`,
        dead.length === initial.length
      ),
      super.buildProgressItem(
        "New pods running",
        `${running.length}/${initial.length}`,
        running.length === initial.length
      ),
    ];
  }

  kapiVerb() { return "image_reload"; }
}