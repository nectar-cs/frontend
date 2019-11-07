//@flow
import Setter from "../../utils/StateGulp";
import type {RemoteBundle} from "../../types/Types";
import Helper from "./Helper";
const StringSimilarity = require('string-similarity');

class GitAndImgSetter extends Setter{
  constructor(type, ...defaultArgs){
    super(...defaultArgs);
    this.type = type;
  }

  remoteList(bundle){
    return bundle[`${this.type}RemoteList`];
  }
}

class GitRemoteListSetter extends GitAndImgSetter {
  sideEffects(bundle) {
    const remoteList: Array<RemoteBundle> = this._value;
    const firstRemote: string = remoteList[0].identifier;
    return { [`${this.type}RemoteName`]: firstRemote };
  }
}

class RemoteNameSetter extends GitAndImgSetter {
  guessRepo(target: string, options: string[]){
    const sorting = StringSimilarity.findBestMatch(target, options);
    return options[sorting.bestMatchIndex];
  }

  sideEffects(bundle) {
    const remoteName: string = this._value;
    const remoteList: Array<RemoteBundle> = this.remoteList(bundle);
    const repoNames = Helper.repoOptions(remoteList, remoteName);
    const firstRepoName = this.guessRepo(bundle.deploymentName, repoNames);
    return { [`${this.type}RepoName`]: firstRepoName };
  }
}

class RepoNameSetter extends GitAndImgSetter {
  repoObject(bundle){
    const { gitRepoName, gitRemoteList, gitRemoteName } = bundle;
    return Helper.selectedRepo(gitRemoteList, gitRemoteName, gitRepoName);
  }

  firstDockerfilePath(bundle){
    const key = `${bundle.gitRemoteName}_${this._value}`;
    const paths = bundle.dfPathDict[key];
    if(paths != null) return paths[0];
    bundle.fetchDfPaths(bundle.gitRemoteName, this._value);
    return null;
  }

  sideEffects(bundle) {
    if(this.type === 'git'){
      const repo = this.repoObject(bundle);
      const dfPath = this.firstDockerfilePath(bundle);
      return { framework: repo.framework, dfPath };
    } else return null;
  }
}

class DfPathDictSetter extends Setter {
  sideEffects(bundle) {
    const newDict = this._value;
    const { gitRemoteName, gitRepoName } = bundle;
    const pathList = newDict[`${gitRemoteName}_${gitRepoName}`];
    return { dfPath: pathList[0] };
  }
}

class DfPathSetter extends Setter {
  sideEffects(bundle) {
    const { dfPath } = bundle;
    const buildCtxPath = dfPath.replace("Dockerfile", "");
    return { buildCtxPath }
  }
}

export default class Gulper{
  constructor(){
    const dfPath = new DfPathSetter();
    const dfPathDict = new DfPathDictSetter({dfPath});

    const gitRepoName = new RepoNameSetter('git');
    const gitRemoteName = new RemoteNameSetter('git', {gitRepoName});
    const gitRemoteList = new GitRemoteListSetter('git', {gitRemoteName});

    const imgRepoName = new RepoNameSetter('img');
    const imgRemoteName = new RemoteNameSetter('img', {imgRepoName});
    const imgRemoteList = new GitRemoteListSetter('img', {imgRemoteName});

    this.master = new Setter({
      gitRemoteList,
      gitRemoteName,
      gitRepoName,
      imgRemoteList,
      imgRemoteName,
      imgRepoName,
      dfPathDict,
      dfPath
    });
  }

  assign(key, value, bundle){
    this.master.update(key, value, bundle);
    return this.master.produce();
  }
}