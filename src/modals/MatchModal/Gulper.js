import Setter from "../../utils/StateGulp";
import type {RemoteBundle} from "../../types/Types";
import Helper from "./Helper";

class GitRemoteListSetter extends Setter {
  sideEffects(bundle) {
    const remoteList: Array<RemoteBundle> = this._value;
    const firstRemote: string = remoteList[0].identifier;
    return this.assignDown('gitRemoteName', firstRemote);
  }
}

class GitRemoteNameSetter extends Setter {
  sideEffects(bundle) {
    const remoteName: string = this._value;
    const remoteList: Array<RemoteBundle> = bundle.gitRemoteList;
    const remote = Helper.selectedRemote(remoteList, remoteName);
    const firstRepo = remote && remote.contents[0].name;
    return this.assignDown('gitRepoName', firstRepo);
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
    return {
      framework: repo.framework,
      dfPath: this.firstDockerfilePath(bundle)
    }
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

export default class Gulper{
  constructor(){
    const dfPathDict = new DfPathDictSetter();
    const gitRepoName = new GitRepoNameSetter();
    const gitRemoteName = new GitRemoteNameSetter({gitRepoName});
    const gitRemoteList = new GitRemoteListSetter({gitRemoteName});

    this.master = new Setter({
      gitRemoteList,
      gitRemoteName,
      gitRepoName,
      dfPathDict
    });
  }

  assign(key, value, bundle){
    this.master.update(key, value, bundle);
    return this.master.produce();
  }
}