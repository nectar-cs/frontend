import Kapi from "../../utils/Kapi";
import DataUtils from "../../utils/DataUtils";
import React from "react";
import {DesiredStatePodTable, DesiredTagPodTable, StdPodTable} from "./PodTableRenderers";
import SameTagOpHelper from "./OpHelpers/SameTagOpHelper";
import DiffTagOpHelper from "./OpHelpers/DiffTagOpHelper";

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
      default:
        throw `No helper for op type ${opType}`;
    }

    if(!(inst.opHelper instanceof oughtToBeClass)){
      inst.opHelper = new oughtToBeClass();
      // console.log(`New cached helper: ${oughtToBeClass.name}`)
    }

    const { initialPods, updatedPods } = inst.state;
    const bundle = { initialPods, updatedPods, startTime: inst.startTime };
    inst.opHelper.refresh(bundle);
    return inst.opHelper;
  }

  static podsRenderer(inst){
    if(inst.isConfiguring()) return StdPodTable;
    else if(inst.isSubmitted() || inst.isConcluded()){
      if(inst.isReload()) return DesiredStatePodTable;
      else return DesiredTagPodTable;
    }
  }
}
