import Kapi from "../../../utils/Kapi";
import Job from "./Job";
import {isEqual} from "lodash";

export default class PodJob extends Job {

  constructor(...args){
    super(...args);
    this.initial = [];
    this.updated = [];
  }

  async initiateWork() {
    this.initial = await this.fetchPods();
    const ep = `/api/run/${this.kapiVerb()}`;
    const payload = this.toKapiPayload();
    await Kapi.blockingPost(ep, payload);
  }

  toKapiPayload(){
    const { name, namespace } = this.deployment;
    return { depNamespace: namespace,  depName: name };
  }

  async reloadData() {
    this.updated = await this.fetchPods();
  }

  async fetchPods() {
    const {name, namespace} = this.deployment;
    const ep = `/api/deployments/${namespace}/${name}/pods`;
    return (await Kapi.blockingFetch(ep))['data'];
  }

  arePodsInState(pods, count, func, targetValue){
    const actualStates = pods.map(func);
    const targetStates = Array.from(Array(count), () => targetValue);
    return isEqual(actualStates, targetStates);
  }

  newPods(){
    const oldNames = this.initial.map(op => op.name);
    return this.updated.filter(newPod => (
      !oldNames.includes(newPod.name)
    ));
  }

  runningPods(pods = this.updated){
    return pods.filter(p =>
      p.state.toLowerCase() === 'running'
    );
  }

  deadPods(){
    const crtAndRunning = this.runningPods(this.updated);
    const crtRunningNames = crtAndRunning.map(op => op.name);

    return this.initial.filter(initialPod => (
      !crtRunningNames.includes(initialPod.name)
    ));
  }

  kapiVerb(){ return ""; }
}