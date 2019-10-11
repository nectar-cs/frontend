import MiscUtils from "../../../utils/MiscUtils";
import {stacks} from "../../../misc/stacks";

const StringSimilarity = require('string-similarity');

export class FormHelper {

  static remoteOptions(remoteList){
    const names = remoteList.map(r => r.identifier);
    return MiscUtils.arrayOptions(names);
  }

  static selectedRemote(remoteList, remoteName){
    return remoteList.find(
      remote => remote.identifier === remoteName
    )
  }

  static repoNames(remoteList, remoteName){
    if(!remoteName) return [];
    const selRemote = this.selectedRemote(remoteList, remoteName);
    return selRemote.contents.map(repo => repo.name);
  }

  static repoOptions(inst, remoteName){
    const names = this.repoNames(inst, remoteName);
    return MiscUtils.arrayOptions(names);
  }

  static selectedRepo(remoteList, remoteName, repoName){
    const selRemote = this.selectedRemote(remoteList, remoteName);
    return selRemote.contents.find(remote => remote.name === repoName);
  }

  static frameworkOptions(){
    return MiscUtils.arrayOptions(stacks.sort());
  }

  static guessRepo(repoNames, depName){
    const sorting = StringSimilarity.findBestMatch(depName, repoNames);
    return repoNames[sorting.bestMatchIndex];
  }

  static setRemotesList(type, inst, remoteList){
    const remote = remoteList[0].identifier;
    const output = { [`${type}RemoteList`]: remoteList };
    const downstream = this.setRemoteName(type, inst, remote, output);
    return { ...output, ...downstream };
  }

  static setRemoteName(type, inst, remoteName, upChanges){
    const remoteList = (upChanges || inst.state.bundle)[`${type}RemoteList`];
    const output = { [`${type}RemoteName`]: remoteName };
    const repoNames = this.repoNames(remoteList, remoteName);
    const repoName = this.guessRepo(repoNames, inst.deploymentName);
    const passDown = {...upChanges, ...output};
    const downstream = this.setRepoName(type, inst, repoName, passDown);
    return {...output, ...downstream};
  }

  static setRepoName(type, inst, repoName, upChanges){
    const upstream = upChanges || inst.state.bundle;
    const remoteList = upstream[`${type}RemoteList`];
    const remoteName = upstream[`${type}RemoteName`];
    const repo = this.selectedRepo(remoteList, remoteName, repoName);
    let output = { [`${type}RepoName`]: repoName };
    if(type === 'git') output = {...output, framework: repo.framework};
    return output;
  }

  static frameworkImage(inst){
    if(inst.props.mode === 'detail'){
      return "extension";
    } else {
      const framework = inst.state.bundle.framework;
      return MiscUtils.frameworkImage(framework || 'docker');
    }
  }

  static graphicType(inst) {
    return inst.props.mode === 'detail' ? "icon" : 'image';
  }

  static title(inst){
    if(inst.props.mode === 'detail')
      return "Git and Docker Matching";
    else return inst.props.deployment.name;
  }
}