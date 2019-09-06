import PodOpHelper from "./PodOpHelper";

export default class ScalePodsHelper extends PodOpHelper {

  successMessage() {
    return "Pods scaled to required amount and are running.";
  }

  isTimedOut() {
    const now = new Date().getTime();
    const limitSeconds = Math.abs(this.delta()) * 20;
    return ((now - this.startedAt) / 1000) > limitSeconds;
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
    const dead = this.deadPods();
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
          "Excess pods gone",
          `${dead.length}/${-this.delta()}`,
          dead.length === -this.delta()
        )
      ]
    }
  }
}