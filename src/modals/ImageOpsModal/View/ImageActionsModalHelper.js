import DataUtils from "../../../utils/DataUtils";
import React from "react";
import ForceImagePullOperator from "../ImageOperators/ForceImagePullOperator";
import ChangeImageTagOperator from "../ImageOperators/ChangeImageTagOperator";
import ScalePodsOperator from "../ImageOperators/ScalePodsOperator";
import Backend from "../../../utils/Backend";
import moment from "moment";
import {defaults} from "./defaults";
import BuildPushRunOperation from "../ImageOperators/BuildPushRunOperation";

export class ImageActionsModalHelper {

  static selectedBranchBundle(remotes, branchName){
    const { gitBranches } = remotes;
    if(!gitBranches) return null;
    return gitBranches[branchName];
  }

  static defaultOpType(props){
    const { matching } = props;
    if(matching && matching.imgRemoteId){
      return props.operationType || "reload";
    } else {
      return props.operationType || "change";
    }
  }

  static fetchImgTags(inst){
    let {imgRemoteId, imgRepoName} = inst.props.matching || {};

    if(!(imgRemoteId && imgRepoName)) {
      const imageTags = null;
      inst.setState(s => ({...s, remotes: { ...s.remotes, imageTags }}));
      return;
    }

    const ep = `/remotes/${imgRemoteId}/${imgRepoName}/branches`;

    Backend.raisingFetch(ep, resp => {
      let imageTags = DataUtils.obj2Camel(resp)['data'];
      imageTags = imageTags.map(t => this.fullImgTag(inst, t));
      const imageTag = imageTags[0];
      inst.setState(s => ({...s, remotes: { ...s.remotes, imageTags }}));
      inst.setState(s => ({...s, choices: { ...s.choices, imageTag }}));
    })
  }

  static fetchGitBranches(inst){
    let {gitRemoteId, gitRepoName} = inst.props.matching || {};
    if(!gitRemoteId || !gitRepoName) {
      const gitBranches = null;
      inst.setState(s => ({...s, remotes: { ...s.remotes, gitBranches }}));
      return;
    }

    const ep = `/remotes/${gitRemoteId}/${gitRepoName}/branches`;

    Backend.raisingFetch(ep, resp => {
      const gitBranches = DataUtils.aToO(
        DataUtils.obj2Camel(resp)['data']
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
      const commits = DataUtils.obj2Camel(resp)['data'];
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

  static opHelper(operationType){
    switch (operationType) {
      case "reload":
        return ForceImagePullOperator;
      case "change":
      case "choose":
      case "docker":
        return ChangeImageTagOperator;
      case "scale":
        return ScalePodsOperator;
      case "git":
        return BuildPushRunOperation;
      default:
        throw `No helper for op type ${operationType}`;
    }
  }

  static defOutImageName(props){
    const { matching, deployment } = props;
    if(matching)
      return `${matching.imgRemoteName}/${matching.imgRepoName}:latest`;
    else if(deployment)
      return deployment.imageName;
    else return "";
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
    const { gitRemoteName, gitRepoName} = inst.props.matching || {};
    const { dockerfilePath } = inst.props.matching || {};

    const interp = {
      dep: name,
      ns: namespace,
      orig: replicas,
      img: imageName,
      dImg: outImageName,
      sha: gitCommit,
      gRem: gitRemoteName,
      gRep: gitRepoName,
      dPath: (dockerfilePath || '').replace("/Dockerfile", ""),
      scaleTo
    };
    return defaults.previewCommands[type](interp) || [];
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
