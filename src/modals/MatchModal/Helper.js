//@flow

import DataUtils from "../../utils/DataUtils";
import Backend from "../../utils/Backend";
import MiscUtils from "../../utils/MiscUtils";
import type {RemoteBundle, RemoteRepo} from "../../types/Types";

export default class Helper{

  static async submit(deploymentName, bundle, callback){
    const payload = {...bundle, deployment: deploymentName };
    console.log(payload);
    const matching = await Backend.bPost('/microservices', payload);
    console.log("OUTCOME ");
    console.log(matching);
    callback(matching);
  }

  static async fetchGitRemotes(inst){
    inst.setState(s => ({...s, isGitFetching: true}));
    const ep = '/remotes/loaded?entity=git';
    const remotesList: RemoteBundle[] = await Backend.bFetch(ep);
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

  static dfPathChoices(remoteName, repoName, dfPathDict){
    return dfPathDict[`${remoteName}_${repoName}`] || [];
  }

  static selectedRemote(remoteList, remoteName){
    return remoteList.find(
      remote => remote.identifier === remoteName
    )
  }

  static selectedRepo(remoteList, remoteName, repoName){
    const remote = this.selectedRemote(remoteList, remoteName);
    return remote ? remote.contents.find(r => r.name === repoName) : null;
  }

  static injestMatching(matching, callback){
    if(!matching) return;
    const {gitRemoteName, gitRepoName} = matching;
    const {imgRemoteName, imgRepoName, framework} = matching;
    const bun = { gitRemoteName, gitRepoName, imgRemoteName, imgRepoName, framework };
    Object.keys(bun).forEach(key => { callback(key, bun[key]); });
  }

  static frameworkImage(mode: 'detail' | 'tutorial', framework: string): string {
    if(mode === 'detail'){
      return "attachment";
    } else {
      return MiscUtils.frameworkImage(framework || 'docker');
    }
  }

  static graphicType(mode: 'detail' | 'tutorial'):string {
    return mode === 'detail' ? "icon" : 'image';
  }

  static title(inst){
    if(inst.props.mode === 'detail')
      return "Git and Docker Matching";
    else return inst.props.deployment.name;
  }

  static async fetchDfPaths(remote, repo, hash, loadingCallback, setter){
    loadingCallback(true);
    const ep = `/remotes/${remote}/${repo}/dockerfile_paths`;
    const newDfPaths = await Backend.bFetch(ep);
    const dictKey = `${remote}_${repo}`;
    setter({ ...hash, [dictKey]: newDfPaths });
    loadingCallback(false);
  }


  static isLoading(inst){
    const { isGitFetching, isDockerFetching } = inst.state;
    const { isSubmitting, isPathsFetching } = inst.state;
    return isGitFetching || isDockerFetching || isSubmitting || isPathsFetching;
  }
}
