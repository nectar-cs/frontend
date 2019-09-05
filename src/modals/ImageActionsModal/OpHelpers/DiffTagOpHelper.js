import PodOpHelper from "./PodOpHelper";

export default class DiffTagOpHelper extends PodOpHelper {

  successMessage() {
    return "All pods running the new image.";
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
    return {...pod, desiredImage: this.targetImage};
  }

  patchedPods(){
    return this.podsWithImage(this.initial.updated, this.targetImage);
  }

  isStableState(){
    return this.bigCheck(
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
        "Excess pods gone",
        `${patched.length}/${this.initial.length}`,
        patched.length === this.initial.length
      )
    ]
  }
}