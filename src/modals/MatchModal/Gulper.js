//@flow
import Setter from "../../utils/StateGulp";
import type {RemoteBundle} from "../../types/Types";
import Helper from "./Helper";
const StringSimilarity = require('string-similarity');

class GitRemoteListSetter extends Setter {
  sideEffects(bundle) {
    const remoteList: Array<RemoteBundle> = this._value;
    const firstRemote: string = remoteList[0].identifier;
    return { gitRemoteName: firstRemote };
  }
}

class GitRemoteNameSetter extends Setter {
  guessRepo(target: string, options: string[]){
    const sorting = StringSimilarity.findBestMatch(target, options);
    return options[sorting.bestMatchIndex];
  }

  sideEffects(bundle) {
    const remoteName: string = this._value;
    const remoteList: Array<RemoteBundle> = bundle.gitRemoteList;
    const repoNames = Helper.repoOptions(remoteList, remoteName);
    const firstRepoName = this.guessRepo(bundle.deploymentName, repoNames);
    return { gitRepoName: firstRepoName };
  }
}

class GitRepoNameSetter extends Setter {
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
    const repo = this.repoObject(bundle);
    const dfPath = this.firstDockerfilePath(bundle);
    return { framework: repo.framework, dfPath };
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
    const gitRepoName = new GitRepoNameSetter();
    const gitRemoteName = new GitRemoteNameSetter({gitRepoName});
    const gitRemoteList = new GitRemoteListSetter({gitRemoteName});

    this.master = new Setter({
      gitRemoteList,
      gitRemoteName,
      gitRepoName,
      dfPathDict,
      dfPath
    });
  }

  assign(key, value, bundle){
    this.master.update(key, value, bundle);
    return this.master.produce();
  }
}