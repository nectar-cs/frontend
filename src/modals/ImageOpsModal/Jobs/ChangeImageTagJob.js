import PodJob from "./PodJob";

export default class ChangeImageTagJob extends PodJob {
  prepare(bundle){
    super.prepare(bundle);
    this.imageName = bundle.imageName;
    console.log("STARTING CHANGE IMAGE JOB");
    console.log(bundle);
  }

  recomputeState() {
    const patched = this.readyPods();
    if(patched.length === this.initial.length){
      if(this.deadPods().length === this.initial.length){
        this.conclude(true);
      }
    }
  }

  readyPods(){
    const patched = this.podsWithImage(this.updated, this.imageName);
    return this.runningPods(patched);
  }

  progressItems(){
    console.log("YOOOOOOOOO cjamge");
    const patched = this.readyPods();
    const dead = this.deadPods();
    return [
      this.buildProgressItem(
        "Pods running new image",
        `${patched.length}/${this.initial.length}`,
        this.simpleStatus(patched.length === this.initial.length)
      ),
      this.buildProgressItem(
        "Old Pods Gone",
        `${dead.length}/${this.initial.length}`,
        this.simpleStatus(dead.length === this.initial.length)
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