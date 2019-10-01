import Kapi from "../../utils/Kapi";
import DataUtils from "../../utils/DataUtils";
import React from "react";
import {DesiredStatePodTable, DesiredTagPodTable, StdPodTable} from "./PodTableRenderers";
import SameTagOpHelper from "./OpHelpers/SameTagOpHelper";
import DiffTagOpHelper from "./OpHelpers/DiffTagOpHelper";
import ScalePodsHelper from "./OpHelpers/ScalePodsHelper";
import Backend from "../../utils/Backend";

export class ImageActionsModalHelper {

  static fetchPods(inst, field, runAfter){
    const { name, namespace } = inst.props.deployment;
    const endpoint = `/api/deployments/${namespace}/${name}/pods`;
    Kapi.fetch(endpoint, (resp) => {
      if(!inst._isMounted) return;
      const data = DataUtils.objKeysToCamel(resp)['data'];
      inst.setState(s => ({...s, [field]: data}));
      runAfter && runAfter();
    })
  }

  static fetchDockerImgs(inst){
    let {imgRemoteId, imgRepoName} = inst.props.matching;

    if(!imgRemoteId || !imgRepoName) {
      const imageTags = null;
      inst.setState(s => ({...s, remotes: { ...s.remotes, imageTags }}));
      return;
    }

    const ep = `/remotes/${imgRemoteId}/${imgRepoName}/branches`;

    Backend.raisingFetch(ep, resp => {
      let imageTags = DataUtils.objKeysToCamel(resp)['data'];
      imageTags = imageTags.map(t => this.fullImgTag(inst, t));
      const imageTag = imageTags[0];
      inst.setState(s => ({...s, remotes: { ...s.remotes, imageTags }}));
      inst.setState(s => ({...s, choices: { ...s.choices, imageTag }}));
    })
  }

  static fetchGitBundle(inst){
    const ep = `/image_registries/loaded`;
    Backend.raisingFetch(ep, resp => {
      const imageRegs = DataUtils.objKeysToCamel(resp)['data'];
      inst.setState(s => ({...s, imageRegs}));
      inst.onAssignment({imgRegistry: imageRegs[0].identifier});
      inst.onAssignment({imgRepo: this.guessImgRepo(imageRegs)});
      inst.onAssignment({imgSource: this.guessImgSource(imageRegs)});
    })
  }

  static guessImgRepo(imageRegs){
    return imageRegs[0].contents[0].name;
  }

  static guessImgSource(imageRegs){
    return imageRegs[0].contents[0].images[0].name;
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
      case "docker":
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
      startTime: inst.startTime
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
      case 'docker':
      case 'change': return DesiredTagPodTable;
      default: throw `No renderer for op type ${opType}`;
    }
  }

  static coerceConfig(config, assignment){
    const key = Object.keys(assignment)[0];
    if(['imgRegistry', 'imgRepo', 'imgSource'].includes(key)){
      const imageName = this.fullImgTag(config);
      return {...config, imageName};
    } else return config;
  }

  static setBranch(inst, gitBranch){
    inst.setState(s => ({...s, choices: {...s.choices, gitBranch}}));
    if(!inst.state.remotes.gitBranches[gitBranch]){
      inst.setState(s => ({...s, isFetching: true}));
      Backend.raisingFetch(``, resp => {
        const commits = DataUtils.objKeysToCamel(resp)['data'];
        inst.setState(s => ({
          ...s,
          remotes: {
            ...s.remotes,
            gitBranches: {
              ...s.remotes.gitBranches,
              [gitBranch]: commits
            }}
        }));
      });
    }
  }

  static fullImgTag(inst, imageTag){
    const {imgRemoteName, imgRepoName} = inst.props.matching;
    return `${imgRemoteName}/${imgRepoName}:${imageTag}`;
  }

}
