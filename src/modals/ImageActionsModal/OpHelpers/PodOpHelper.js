import isEqual from 'lodash/isEqual';


export default class PodOpHelper {

  constructor(){
    this.initial = [];
    this.updated = [];
  }

  refresh(bundle){
    this.initial = this.removeTerminating(bundle.initialPods);
    this.updated = this.removeTerminating(bundle.updatedPods);
    this.startedAt = bundle.startedAt;
    this.scaleTo = parseInt(bundle.scaleTo);
    this.targetImage = bundle.imageName;
    this.conclusion = bundle.conclusion;
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

  checkGroupInState(pods, count, func, targetValue){
    const actualStates = pods.map(func);
    const targetStates = Array.from(Array(count), () => targetValue);
    // console.log(typeof(count));
    // console.log(`COMPARE ${actualStates} =?= ${targetStates} (${count})`);
    return isEqual(actualStates, targetStates);
  }

  progressItemStatus(bool){
    if(bool) return 'done';
    if(this.conclusion === null || this.conclusion === undefined)
      return bool ? 'done' : 'working';
    else if(this.conclusion === true)
      return 'done';
    else if(this.conclusion === false)
      return 'failed';
  }

  buildProgressItem(title, detail, bool){
    return({
      name: title,
      detail: detail,
      status: this.progressItemStatus(bool)
    })
  }

  buildPodList() { throw `Method buildPodList not implemented!`; }
  isStableState(){ throw `Method isStableState not implemented!`; }
  isCrashedState(){ throw `Method isCrashedState not implemented!`; }
  isTimedOut(){ throw `Method isTimedOut not implemented!`; }
  successMessage(){ throw `Method successMessage not implemented!`; }
  progressItems(failed){ throw `Method progressItems not implemented!`; }
}