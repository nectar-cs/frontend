export default class PodOpHelper {

  constructor(){
    this.initial = [];
    this.updated = [];
  }

  refresh(bundle){
    this.initial = this.removeTerminating(bundle.initialPods);
    this.updated = this.removeTerminating(bundle.updatedPods);
    this.startedAt = bundle.startedAt;
    this.scaleTo = bundle.scaleTo;
    this.hasFailed = bundle.hasFailed;
    this.targetImage = bundle.imageName;
  }

  removeTerminating(pods){
    if(!pods) return pods;
    return pods.filter(pod => (
      !pod.state.toLowerCase().includes('terminat')
    ))
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

  podsWithImage(pods, image){
    return pods.filter(pod => pod.imageName === image);
  }

  strictlyNewPods(emptyOnNull = true){
    if(this.updated === null)
      return emptyOnNull ? [] : null;

    const oldNames = this.initial.map(op => op.name);
    return this.updated.filter(newPod => (
      !oldNames.includes(newPod.name)
    ));
  }

  buildSimplePodList(){
    return this.initial;
  }

  checkGroupInState(pods, count, func, target){
    const actualStates = pods.map(func);
    const targetStates = new Array(count).fill(target);
    return actualStates.every(e => targetStates.includes(e));
  }

  buildProgressItem(title, detail, bool){
    const status = bool ? 'done' : (this.hasFailed ? 'idle' : 'working');
    return({
      name: title,
      detail: detail,
      status: status
    })
  }

  buildPodList() { throw `Method buildPodList not implemented!`; }
  isStableState(){ throw `Method isStableState not implemented!`; }
  isCrashedState(){ throw `Method isCrashedState not implemented!`; }
  isTimedOut(){ throw `Method isTimedOut not implemented!`; }
  successMessage(){ throw `Method successMessage not implemented!`; }
  progressItems(failed){ throw `Method progressItems not implemented!`; }
}