import Kapi from "../../utils/Kapi";
import DataUtils from "../../utils/DataUtils";
import React from "react";
import {DesiredStatePodTable, DesiredTagPodTable, StdPodTable} from "./PodTableRenderers";

export class ImageActionsModalHelper {

  static fetchPods(inst, field, runAfter){
    const { name, namespace } = inst.props.deployment;
    const endpoint = `/api/deployments/${namespace}/${name}/pods`;
    Kapi.fetch(endpoint, (resp) => {
      if(!inst._isMounted) return;
      const data = DataUtils.objKeysToCamel(resp)['data'];
      console.table(data);
      inst.setState(s => ({...s, [field]: data}));
      runAfter && runAfter(data);
    })
  }

  static opHelper(inst){
    if(inst.isConfiguring())
      return StdImageHelper;
    else{
      if(inst.isReload()) return SameImageHelper;
      else return ChangeImageHelper;
    }
  }

  static podsRenderer(inst){
    if(inst.isConfiguring()) return StdPodTable;
    else if(inst.isSubmitted() || inst.isConcluded()){
      if(inst.isReload()) return DesiredStatePodTable;
      else return DesiredTagPodTable;
    }
  }
}

export class SameImageHelper {
  static enrichOldPod(newPods, pod){
    let actualState;
    if(newPods != null){
      const newSelf = newPods.find(newPod => newPod.name === pod.name);
      actualState = newSelf ? newSelf.state : 'gone';
    } else actualState = pod.state;
    return { ...pod, desiredState: 'gone', state: actualState }
  }

  static enrichNewPod(pod){
    return { ...pod, desiredState: 'running' }
  }

  static strictlyNewPods(initialPods, updatedPods){
    if(updatedPods === null) return null;

    const oldNames = initialPods.map(op => op.name);
    return updatedPods.filter(newPod => (
      !oldNames.includes(newPod.name)
    ));
  }

  static buildPodList(initialPods, updatedPods){
    const initial = initialPods;
    const updated = this.strictlyNewPods(initial, updatedPods);
    const enrichedOldPods = initial.map(p => this.enrichOldPod(updated, p));
    const enrichedNewPods = (updated || []).map(p => this.enrichNewPod(p));
    return enrichedOldPods.concat(enrichedNewPods);
  }

  static isStableState(initial, updated){
    updated = this.strictlyNewPods(initial, updated);
    const updatedPodStates = updated.map(p => p.state.toLowerCase());
    const synthList = [...new Set(updatedPodStates)];

    if(initial.length === updated.length)
      return synthList.length === 1 && synthList[0] === 'running';
    return false;
  }

  static isTimedOut(initial, updated, startedAt){
    const now = new Date().getTime();
    const limitSeconds = initial.length * 20;
    return ((now - startedAt) / 1000) > limitSeconds;
  }

  static isCrashedState(initial, updated){
    return { isCrashed: false, reason: "Because" }
  }

  static runningPods(pods){
    return pods.filter(p =>
      p.state.toLowerCase() === 'running'
    );
  }

  static deadPods(initial, updated){
    if(updated.length < initial.length) return [];

    return initial.filter(initialPod => (
      !updated.includes(initialPod)
    ));
  }

  static successMessage(){
    return "All pods running the old image have been replaced."
  }

  static progressItems(initial, updated, failed){
    const dead = this.deadPods(initial, updated);
    const created = this.strictlyNewPods(initial, updated);
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

export class StdImageHelper {
  static buildPodList(initialPods, _){
    return initialPods;
  }
}

export class ChangeImageHelper {
  static buildPodList(_, updatedPods){
    return updatedPods;
  }
}
