import Kapi from "../../utils/Kapi";
import DataUtils from "../../utils/DataUtils";
import React from "react";
import {DesiredStatePodTable, DesiredTagPodTable, StdPodTable} from "./PodTableRenderers";
import SameTagOpHelper from "./OpHelpers/SameTagOpHelper";
import DiffTagOpHelper from "./OpHelpers/DiffTagOpHelper";
import ScalePodsHelper from "./OpHelpers/ScalePodsHelper";
import {CONCLUSION_FAILED, CONCLUSION_SUCCESS} from "./ImageActionsModal";

export class ImageActionsModalHelper {

  static fetchPods(inst, field, runAfter){
    const { name, namespace } = inst.props.deployment;
    const endpoint = `/api/deployments/${namespace}/${name}/pods`;
    Kapi.fetch(endpoint, (resp) => {
      if(!inst._isMounted) return;
      const data = DataUtils.objKeysToCamel(resp)['data'];
      // console.table(data);
      inst.setState(s => ({...s, [field]: data}));
      runAfter && runAfter();
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
      case "reload": return "image_reload";
      case "scale": return "scale_replicas";
      case "change": return "new_image";
      default: throw `No helper for op type ${opType}`;
    }
  }

  static makeOpHelperBundle(inst){
    const { initialPods, updatedPods, conclusion } = inst.state;
    const { imageName, scaleTo } = inst.state.config;
    return {
      initialPods,
      updatedPods,
      scaleTo,
      imageName,
      conclusion,
      startTime: inst.startTime,
      hasFailed: inst.isOpFailed()
    };
  }

  static podsRenderer(inst){
    if(inst.isConfiguring()) return StdPodTable;
    else if(inst.isSubmitted() || inst.isConcluded()){
      return this.podRendererAfterSubmit(inst.state.config.operationType)
    }
  }

  static podRendererAfterSubmit(opType){
    switch(opType){
      case 'reload':
      case 'scale': return DesiredStatePodTable;
      case 'change': return DesiredTagPodTable;
      default: throw `No renderer for op type ${opType}`;
    }
  }
}
