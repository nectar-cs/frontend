import PodOpHelper from "./PodOpHelper";

export default class GitBuildOpHelper extends PodOpHelper {

  hasTermOutput() {
    return true;
  }

  successMessage() {
    return "All pods running the new image.";
  }

  isCrashedState(){
    return { isCrashed: false, reason: "lolz" };
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
        "Git repo cloned",
        `0/1`,
        false
      ),
      super.buildProgressItem(
        "New image",
        `building`,
        false,
      ),
      super.buildProgressItem(
        "Pods running new image",
        `${patched.length}/${this.initial.length}`,
        patched.length === this.initial.length
      )
    ]
  }
}