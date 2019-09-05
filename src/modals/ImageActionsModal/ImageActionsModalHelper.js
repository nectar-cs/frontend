import Kapi from "../../utils/Kapi";
import DataUtils from "../../utils/DataUtils";
import React from "react";
import {DesiredStatePodTable, DesiredTagPodTable, StdPodTable} from "./PodTableRenderers";
import SameTagOpHelper from "./OpHelpers/SameTagOpHelper";
import DiffTagOpHelper from "./OpHelpers/DiffTagOpHelper";
import ScalePodsHelper from "./OpHelpers/ScalePodsHelper";

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
    const opType = inst.state.config.operationType;

    let oughtToBeClass;
    switch (opType) {
      case "reload":
        oughtToBeClass = SameTagOpHelper;
        break;
      case "change":
      case "choose":
      case "docker":
        oughtToBeClass = DiffTagOpHelper;
        break;
      case "scale":
        oughtToBeClass = ScalePodsHelper;
        break;
      default:
        throw `No helper for op type ${opType}`;
    }

    if(!(inst.opHelper instanceof oughtToBeClass)){
      inst.opHelper = new oughtToBeClass();
      // console.log(`New cached helper: ${oughtToBeClass.name}`)
    }

    inst.opHelper.refresh(this.makeOpHelperBundle(inst));
    return inst.opHelper;
  }

  static urlAction(inst){
    const opType = inst.state.config.operationType;

    switch (opType) {
      case "reload":
        return "image_reload";
      case "scale":
        return "scale_replicas";
      default:
        throw `No helper for op type ${opType}`;
    }
  }

  static makeOpHelperBundle(inst){
    const { initialPods, updatedPods } = inst.state;
    return {
      initialPods,
      updatedPods,
      startTime: inst.startTime,
      scaleTo: inst.state.config.scaleTo,
      hasFailed: inst.isOpFailed()
    };
  }

  static podsRenderer(inst){
    if(inst.isConfiguring()) return StdPodTable;
    else if(inst.isSubmitted() || inst.isConcluded()){
      if(inst.isReload()) return DesiredStatePodTable;
      else return DesiredTagPodTable;
    }
  }
}
