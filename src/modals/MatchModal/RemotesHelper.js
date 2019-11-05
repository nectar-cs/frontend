import MiscUtils from "../../utils/MiscUtils";
import {stacks} from "../../misc/stacks";
const StringSimilarity = require('string-similarity');

export default class RemotesHelper{

  static remoteOptions(remoteList){
    // return remoteList.map(r => r.identifier);
    return [];
  }

  static dockerfileChoices(){
    return []
  }

  static selectedRemote(remoteList, remoteName){
    return remoteList.find(
      remote => remote.identifier === remoteName
    )
  }

  static repoNames(remoteList, remoteName){
    if(!remoteName) return [];
    const selRemote = this.selectedRemote(remoteList, remoteName);
    if(selRemote) return selRemote.contents.map(repo => repo.name);
    else return [];
  }

  static repoOptions(inst, remoteName){
    const names = this.repoNames(inst, remoteName);
    return MiscUtils.arrayOptions(names);
  }

  static selectedRepo(remoteList, remoteName, repoName){
    const selRemote = this.selectedRemote(remoteList, remoteName);
    return selRemote.contents.find(remote => remote.name === repoName);
  }

  static guessRepo(repoNames, depName){
    const sorting = StringSimilarity.findBestMatch(depName, repoNames);
    return repoNames[sorting.bestMatchIndex];
  }


}