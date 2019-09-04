import Kapi from "../../utils/Kapi";
import DataUtils from "../../utils/DataUtils";

export class ImageActionsModalHelper {

  static fetchPods(inst, field, runAfter){
    const { name, namespace } = inst.props.deployment;
    const endpoint = `/api/deployments/${namespace}/${name}/pods`;
    Kapi.fetch(endpoint, (resp) => {
      if(!inst._isMounted) return;
      const data = DataUtils.objKeysToCamel(resp)['data'];
      console.table(data);
      inst.setState(s => ({...s, [field]: data}));
      runAfter && runAfter();
    })
  }

  static reloadPods(inst, force){
    if(force || inst.props.submitting){
      let repeat = () => setTimeout(this.reloadPods, 1000);
      this.fetchPods(inst, 'updatedPods', repeat)
    }
  }
}

export class ReplaceImageHelper {
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
}