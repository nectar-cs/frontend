import Kapi from "../../../utils/Kapi";
import Job from "./Job";
import {isEqual} from "lodash";
import {init} from "@sentry/browser";

export default class PodJob extends Job {

  constructor(...args){
    super(...args);
    this.initial = [];
    this.updated = [];
  }

  prepare(bundle){
    this.deployment = bundle.deployment;
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
    return await Kapi.bFetch(ep);
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

  crashedPods(source = this.newPods()){
    return source.filter(pod => pod.state === 'Error');
  }

  podsWithImage(pods, image){
    return pods.filter(pod => pod.imageName === image);
  }

  kapiVerb(){ return ""; }
}