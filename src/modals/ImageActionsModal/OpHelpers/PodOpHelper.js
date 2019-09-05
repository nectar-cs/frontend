export default class PodOpHelper {

  constructor(){
    this.initial = [];
    this.updated = [];
  }

  refresh(bundle){
    this.initial = bundle.initialPods;
    this.updated = bundle.updatedPods;
    this.startedAt = bundle.startedAt;
  }

  runningPods(pods){
    return pods.filter(p =>
      p.state.toLowerCase() === 'running'
    );
  }

  deadPods(){
    if(this.updated === null) return [];
    if(this.updated.length < this.initial.length) return [];

    return this.initial.filter(initialPod => (
      !this.updated.includes(initialPod)
    ));
  }

  strictlyNewPods(emptyOnNull = true){
    if(this.updated === null)
      return emptyOnNull ? [] : null;

    const oldNames = this.initial.map(op => op.name);
    return this.updated.filter(newPod => (
      !oldNames.includes(newPod.name)
    ));
  }

  isStableState(){ throw `Method isStableState not implemented!`; }
  isCrashedState(){ throw `Method isCrashedState not implemented!`; }
  isTimedOut(){ throw `Method isTimedOut not implemented!`; }
  successMessage(){ throw `Method successMessage not implemented!`; }
  progressItems(failed){ throw `Method progressItems not implemented!`; }
}