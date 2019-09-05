import PodOpHelper from "./PodOpHelper";

export default class SameTagOpHelper extends PodOpHelper {

  isTimedOut() {
    const now = new Date().getTime();
    const limitSeconds = this.initial.length * 20;
    return ((now - this.startedAt) / 1000) > limitSeconds;
  }

  isStableState() {
    const newPods = this.strictlyNewPods();
    const newPodStates = newPods.map(p => p.state.toLowerCase());
    const synthList = [...new Set(newPodStates)];

    if(this.initial.length === newPods.length)
      return synthList.length === 1 && synthList[0] === 'running';
    return false;
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
    const enrichedOldPods = this.initial.map(p => (
      this.enrichOldPod(p)
    ));

    const enrichedNewPods = this.strictlyNewPods().map(p => (
      this.enrichNewPod(p)
    ));

    return enrichedOldPods.concat(enrichedNewPods);
  }

  progressItems(failed){
    const initial = this.initial;
    const dead = this.deadPods();
    const created = this.strictlyNewPods();
    const running = this.runningPods(created);

    const status = (bool) => {
      return bool ? 'done' : (failed ? 'idle' : 'working')
    };

    return [
      {
        name: "Old pods gone",
        detail: `${dead.length}/${initial.length}`,
        status: status(dead.length === initial.length)
      },
      {
        name: "New pods created",
        detail: `${created.length}/${initial.length}`,
        status: status(created.length === initial.length)
      },
      {
        name: "New pods running",
        detail: `${running.length}/${initial.length}`,
        status: status(running.length === initial.length)
      },
    ];
  }
}