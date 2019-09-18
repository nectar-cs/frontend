import MiscUtils from "../../../utils/MiscUtils";

const StringSimilarity = require('string-similarity');

export class FormHelper {

  static gitRemoteOptions(gitRemoteList){
    const names = gitRemoteList.map(r => r.identifier);
    return MiscUtils.arrayOptions(names);
  }

  static selectedRemote(gitRemoteList, remoteName){
    return gitRemoteList.find(
      remote => remote.identifier === remoteName
    )
  }

  static gitRepoNames(inst, remoteName){
    if(!remoteName) return [];
    const selRemote = this.selectedRemote(inst, remoteName);
    return selRemote.contents.map(repo => repo.name);
  }

  static gitRepoOptions(inst, remoteName){
    const names = this.gitRepoNames(inst, remoteName);
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

  static frameworkOptions(){
    return MiscUtils.arrayOptions(
      ["javascript", "go", "ruby", "c"]
    );
  }

  static guessRepo(repoNames, depName){
    const sorting = StringSimilarity.findBestMatch(depName, repoNames);
    return repoNames[sorting.bestMatchIndex];
  }

}