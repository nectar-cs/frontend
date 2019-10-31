import isEqual from 'lodash/isEqual';
import Kapi from "../../../utils/Kapi";
import DataUtils from "../../../utils/DataUtils";

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class ImageOperator {

  constructor(bundle){
    this.deployment = bundle.deployment;
    this.matching = bundle.matching;
    this.progressCallback = bundle.progressCallback;
    this.finishedCallback = bundle.finishedCallback;
    this.conclusion = null;
  }

  async perform(){
    this.initial = this.updated = await this.fetchPods();
    await this.submitImageOperation();

    while(!this.conclusion){
      this.updated = await this.fetchPods();
      this.conclusion = this.recomputeState();
      this.broadcastProgress();
      if(!this.conclusion) await sleep(2000);
    }

    this.conclude(this.conclusion);
  }

  recomputeState(){
    if(this.isStableState()) return "done";
    return null;
  }

  submitImageOperation(){
    const ep = `/api/run/${this.imageOperationVerb()}`;
    const payload = this.imageOperationPayload();
    return Kapi.blockingPost(ep, payload);
  }

  imageOperationPayload(){
    return DataUtils.obj2Snake({
      depNamespace: this.deployment.namespace,
      depName: this.deployment.name,
    });
  }

  imageOperationVerb(){
    return "";
  }

  async fetchPods() {
    const {name, namespace} = this.deployment;
    const ep = `/api/deployments/${namespace}/${name}/pods`;
    return DataUtils.obj2Snake((await Kapi.blockingFetch(ep)))['data'];
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
    return isEqual(actualStates, targetStates);
  }

  broadcastProgress(){
    this.progressCallback(this.progressItems())
  }

  progressItemStatus(status){
    if(status === 'done') return status;
    if(this.conclusion !== null)
      return this.conclusion ? 'done' : 'failed';
    else return status;
  }

  buildProgressItem(title, detail, status){
    return({
      name: title,
      detail: detail,
      status: this.progressItemStatus(status)
    })
  }

  conclusionMessage(){
    if(this.conclusion)
      return this.successMessage();
    else return this.failureMessage();
  }

  failureMessage() {
    return this.failureReason;
  }

  conclude(success, reason = null){
    this.conclusion = success;
    this.failureReason = reason;
    this.finishedCallback(success);
  }

  didConclude(){
    return this.conclusion !== null;
  }

  terminalOutput(){ return []; }
  hasTermOutput(){ return false; }
  isStableState(){ return false }
  successMessage(){ throw `Method successMessage not implemented!`; }
  progressItems(failed){ throw `Method progressItems not implemented!`; }
}