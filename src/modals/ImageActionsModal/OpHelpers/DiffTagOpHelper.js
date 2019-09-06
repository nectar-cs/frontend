import PodOpHelper from "./PodOpHelper";

export default class DiffTagOpHelper extends PodOpHelper {

  successMessage() {
    return "All pods running the new image.";
  }

  isTimedOut() {
    const now = new Date().getTime();
    const limitSeconds = this.initial.length * 12;
    return ((now - this.startedAt) / 1000) > limitSeconds;
  }

  isCrashedState(){
    return { isCrashed: false, reason: "lolz" };
  }

  enrichPod(pod){
    return {...pod, desiredImage: this.targetImage};
  }

  patchedAndRunningPods(){
    if(!this.updated) return [];
    const patched = super.podsWithImage(this.updated, this.targetImage);
    return super.runningPods(patched);
  }

  isStableState(){
    return this.checkGroupInState(
      super.podsWithImage(this.updated, this.targetImage),
      this.initial.length,
      p => p.state.toLowerCase(),
      'running'
    );
  }

  buildPodList(){
    if(this.updated) {
      return this.updated.map(p => this.enrichPod(p));
    } else return super.buildSimplePodList();
  }

  progressItems(){
    const patched = this.patchedAndRunningPods();
    return [
      super.buildProgressItem(
        "Pods running new image",
        `${patched.length}/${this.initial.length}`,
        patched.length === this.initial.length
      )
    ]
  }
}