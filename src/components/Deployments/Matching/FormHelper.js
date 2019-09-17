import MiscUtils from "../../../utils/MiscUtils";

export default class FormHelper {

  static remotesOptions(inst){
    const names = inst.state.gitRemoteList.map(r => r.identifier);
    return MiscUtils.arrayOptions(names);
  }

  static selectedRemote(inst, remoteName){
    return inst.state.gitRemoteList.find(
      remote => remote.identifier === remoteName
    )
  }

  static gitRepoOptions(inst, remoteName){
    const selRemote = this.selectedRemote(inst, remoteName);
    const names = selRemote.contents.map(repo => repo.name);
    return MiscUtils.arrayOptions(names);
  }

  static selectedRepo(inst, remoteName, repoName){
    const selRemote = this.selectedRemote(inst, remoteName);
    return selRemote.contents.find(remote => remote.name === repoName);
  }

  static registryOptions(inst){

  }

  static imageRepoOptions(){

  }
}