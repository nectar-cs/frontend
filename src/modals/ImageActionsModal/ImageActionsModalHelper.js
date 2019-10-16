import Kapi from "../../utils/Kapi";
import DataUtils from "../../utils/DataUtils";
import React from "react";
import {DesiredStatePodTable, DesiredTagPodTable, StdPodTable} from "./PodTableRenderers";
import SameTagOpHelper from "./OpHelpers/SameTagOpHelper";
import DiffTagOpHelper from "./OpHelpers/DiffTagOpHelper";
import ScalePodsHelper from "./OpHelpers/ScalePodsHelper";
import Backend from "../../utils/Backend";
import moment from "moment";
import {defaults} from "./defaults";

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

  static fetchImgTags(inst){
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

  static fetchGitBranches(inst){
    let {gitRemoteId, gitRepoName} = inst.props.matching;
    if(!gitRemoteId || !gitRepoName) {
      const gitBranches = null;
      inst.setState(s => ({...s, remotes: { ...s.remotes, gitBranches }}));
      return;
    }

    const ep = `/remotes/${gitRemoteId}/${gitRepoName}/branches`;

    Backend.raisingFetch(ep, resp => {
      const gitBranches = DataUtils.aToO(
        DataUtils.objKeysToCamel(resp)['data']
      );
      inst.setState(s => ({...s, remotes: {...s.remotes, gitBranches}}));
      this.setBranch(inst, Object.keys(gitBranches)[0])
    })
  }

  static fetchBranchCommits(inst, gitBranch){
    let {gitRemoteId, gitRepoName} = inst.props.matching;
    let ep = `/remotes/${gitRemoteId}/${gitRepoName}/`;
    ep += `${gitBranch}/commits`;

    inst.setState(s => ({...s, isFetching: true}));
    Backend.raisingFetch(ep, resp => {
      const commits = DataUtils.objKeysToCamel(resp)['data'];
      inst.setState(s => {
        const branches = {...s.remotes.gitBranches, [gitBranch]: commits };
        const remotes = { ...s.remotes, gitBranches: branches };
        const choices = { ...s.choices, gitCommit: commits[0].sha };
        return({...s, isFetching: false, remotes, choices})
      });
    });
  }

  static sideEffect(inst, field, value){
    if(field === 'gitBranch') {
      this.setBranch(inst, value);
      return true;
    }
    return false;
  }

  static setBranch(inst, gitBranch){
    inst.setState(s => ({...s, choices: {...s.choices, gitBranch}}));
    if(inst.state.remotes.gitBranches[gitBranch] === null){
      this.fetchBranchCommits(inst, gitBranch);
    }
  }

  static fullImgTag(inst, imageTag){
    const {imgRemoteName, imgRepoName} = inst.props.matching;
    return `${imgRemoteName}/${imgRepoName}:${imageTag}`;
  }

  static opHelper(inst){
    const opType = inst.state.choices.operationType;

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
    }

    inst.opHelper.refresh(this.makeOpHelperBundle(inst));
    return inst.opHelper;
  }

  static podsRenderer(inst){
    if(inst.isConfiguring()) return StdPodTable;
    else if(inst.isSubmitted() || inst.isConcluded()){
      return this.podRendererAfterSubmit(inst.state.choices.operationType)
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

  static urlAction(inst){
    const opType = inst.state.choices.operationType;

    switch (opType) {
      case "reload": return "image_reload";
      case "scale": return "scale_replicas";
      case "docker":
      case "change": return "new_image";
      default: throw `No helper for op type ${opType}`;
    }
  }

  static defOutImageName(inst){
    const { matching } = inst.props;
    if(matching)
      return `${matching.imgRemoteName}/${matching.imgRepoName}:latest`;
    else return inst.props.deployment.imageName;
  }

  static makeOpHelperBundle(inst){
    const { initialPods, updatedPods, conclusion } = inst.state;
    const { imageName, scaleTo } = inst.state.choices;
    return {
      initialPods,
      updatedPods,
      scaleTo,
      imageName,
      conclusion,
      startTime: inst.startTime
    };
  }

  static commitToS(commit){
    const at = moment(commit.timestamp).fromNow();
    return `"${commit.message}" by ${commit.author} from ${at}`;
  }

  static previewCommands(inst){
    const type = inst.state.choices.operationType;
    const { name, namespace, replicas} = inst.props.deployment;
    const { scaleTo, imageName, outImageName } = inst.state.choices;
    const { gitCommit } = inst.state.choices;
    const {gitRemoteName, gitRepoName} = inst.props.matching;

    const interp = {
      dep: name,
      ns: namespace,
      orig: replicas,
      img: imageName,
      dImg: outImageName,
      sha: gitCommit,
      gRem: gitRemoteName,
      gRep: gitRepoName,
      scaleTo
    };
    return defaults.previewCommands[type](interp);
  }

  static isInputValid(inst){
    const { operationType, imageName, outImageName } = inst.state.choices;
    switch(operationType){
      case 'change': return !!imageName;
      case 'git': return !!outImageName;
      default: return true;
    }
  }
}
