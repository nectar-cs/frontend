import PodJob from "./PodJob";

export default class ForceImagePullJob extends PodJob {

  prepare(bundle) {
    super.prepare(bundle);
    console.log("STARTING FORCE RELOAD IMAGE JOB");
    console.log(bundle);
  }

  recomputeState() {
    if(this.areNewPodsRunning() && this.areOldPodsGone())
      this.conclude(true);
  }

  progressItems(){
    const [_new, dead] = [this.newPods(), this.deadPods()];
    const running = this.runningPods(_new);

    return [
      this.buildProgressItem(
        "Old pods gone",
        `${dead.length}/${this.initial.length}`,
        this.simpleStatus(this.areOldPodsGone())
      ),
      this.buildProgressItem(
        "New pods running",
        `${running.length}/${this.initial.length}`,
        this.simpleStatus(this.areNewPodsRunning())
      ),
    ];
  }

  areNewPodsRunning(){
    const running = this.runningPods(this.newPods());
    return running.length === this.initial.length;
  }

  areOldPodsGone(){
    const dead = this.deadPods();
    return dead.length === this.initial.length;
  }

  kapiVerb() { return "image_reload"; }
}