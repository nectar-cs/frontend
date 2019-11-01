import PodJob from "./PodJob";

export default class ChangeImageTagJob extends PodJob{
  prepare({imageName}){
    this.imageName = imageName;
  }

  recomputeState() {
    const patched = this.readyPods();
    if(patched.length === this.initial.length)
      this.conclude(true);
  }

  readyPods(){
    const patched = this.podsWithImage(this.updated, this.imageName);
    return this.runningPods(patched);
  }

  progressItems(){
    const patched = this.readyPods();
    return [
      super.buildProgressItem(
        "Pods running new image",
        `${patched.length}/${this.initial.length}`,
        patched.length === this.initial.length
      )
    ]
  }

  kapiVerb() { return "new_image"; }

  toKapiPayload() {
    return {
      ...super.toKapiPayload(),
      targetName: this.imageName
    }
  }
}