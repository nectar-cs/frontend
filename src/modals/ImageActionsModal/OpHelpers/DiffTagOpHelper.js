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

  patchedPods(){
    if(!this.updated) return [];
    return this.podsWithImage(this.updated, this.targetImage);
  }

  isStableState(){
    return this.checkGroupInState(
      this.updated,
      this.initial.length,
      p => p.imageName,
      this.targetImage
    );
  }

  buildPodList(){
    if(this.updated) {
      return this.updated.map(p => this.enrichPod(p));
    } else return super.buildSimplePodList();
  }

  progressItems(){
    const patched = this.patchedPods();
    return [
      super.buildProgressItem(
        "Pods running new image",
        `${patched.length}/${this.initial.length}`,
        patched.length === this.initial.length
      )
    ]
  }
}