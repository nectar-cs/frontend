import PodOpHelper from "./PodOpHelper";

export default class SameTagOpHelper extends PodOpHelper {

  isTimedOut() {
    const now = new Date().getTime();
    const limitSeconds = this.initial.length * 20;
    return ((now - this.startedAt) / 1000) > limitSeconds;
  }

  isStableState() {
    return super.eqCountAndState(
      this.strictlyNewPods(),
      this.initial.length
    )
  }

  isCrashedState(){
    return { isCrashed: false, reason: "lolz" };
  }

  successMessage() {
    return "All pods running the old image have been replaced.";
  }

  enrichOldPod(pod){
    const newPods = this.strictlyNewPods(false);
    let actualState;
    if(newPods != null){
      const newSelf = newPods.find(newPod => newPod.name === pod.name);
      actualState = newSelf ? newSelf.state : 'gone';
    } else actualState = pod.state;
    return { ...pod, desiredState: 'gone', state: actualState }
  }

  enrichNewPod(pod){
    return { ...pod, desiredState: 'running' }
  }

  buildPodList(){
    if(this.updated){
      const enrichedOldPods = this.initial.map(p => (
        this.enrichOldPod(p)
      ));

      const enrichedNewPods = this.strictlyNewPods().map(p => (
        this.enrichNewPod(p)
      ));

      return enrichedOldPods.concat(enrichedNewPods);
    } else return super.buildSimplePodList();
  }

  progressItems(){
    const initial = this.initial;
    const dead = this.deadPods();
    const created = this.strictlyNewPods();
    const running = this.runningPods(created);

    return [
      super.buildProgressItem(
        "Old pods gone",
        `${dead.length}/${initial.length}`,
        dead.length === initial.length
      ),
      super.buildProgressItem(
        "New pods created",
        `${created.length}/${initial.length}`,
        created.length === initial.length
      ),
      super.buildProgressItem(
        "New pods running",
        `${running.length}/${initial.length}`,
        running.length === initial.length
      ),
    ];
  }
}