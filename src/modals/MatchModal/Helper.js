//@flow
import Backend from "../../utils/Backend";
import MiscUtils from "../../utils/MiscUtils";
import type {RemoteBundle, RemoteRepo} from "../../types/Types";

export default class Helper{

  static async submit(deploymentName, bundle, callback){
    const payload = {...bundle, deployment: deploymentName };
    const matching = await Backend.bPost('/microservices', payload);
    callback(matching);
  }

  static async delete(matching, callback){
    await Backend.bDelete(`/microservices/${matching.id}`);
    callback(matching);
  }

  static async fetchRemotes(type: 'git' | 'img', dataSet, progSet){
    progSet(type, true);
    if(type === 'img') type = 'docker';
    const remotes = await Backend.bFetch(`/remotes/loaded?entity=${type}`);
    if(type === 'docker') type = 'img';
    progSet(type, false);
    dataSet(type, remotes);
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

  static selectedRepo(remoteList, remoteName, repoName): RemoteRepo {
    const remote = this.selectedRemote(remoteList, remoteName);
    return remote ? remote.contents.find(r => r.name === repoName) : null;
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

  static isLoading(state){
    const { isSubmitting, isPathsFetching, isGitFetching, isImgFetching } = state;
    return isSubmitting || isPathsFetching || isGitFetching || isImgFetching;
  }
}

