//@flow

import MiscUtils from "../../utils/MiscUtils";
import Backend from "../../utils/Backend";
import type {RemoteBundle} from "../../types/Types";
const StringSimilarity = require('string-similarity');

export default class RemotesHelper{

  static async fetchGitRemotes(inst){
    inst.setState(s => ({...s, isGitFetching: true}));
    const ep = '/remotes/loaded?entity=git';
    const remotesList: RemoteBundle[] = await Backend.blockingFetch(ep);
    inst.updateGitRemotesList(remotesList);
    inst.setState(s => ({...s, isGitFetching: false}));
  }

  static remoteOptions(remoteList: ?Array<RemoteBundle>){
    return (remoteList || []).map(r => r.identifier);
  }

  static repoOptions(remoteList: RemoteBundle[], remoteName: string): string[]{
    const remote = remoteList.find(r => r.identifier === remoteName);
    return remote ? remote.contents.map(r => r.name) : [];
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

  static selectedRepo(remoteList, remoteName, repoName){
    const selRemote = this.selectedRemote(remoteList, remoteName);
    return selRemote.contents.find(remote => remote.name === repoName);
  }

  static guessRepo(repoNames, depName){
    const sorting = StringSimilarity.findBestMatch(depName, repoNames);
    return repoNames[sorting.bestMatchIndex];
  }


}