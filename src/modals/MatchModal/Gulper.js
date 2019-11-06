import Setter from "../../utils/StateGulp";
import type {RemoteBundle} from "../../types/Types";

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
    const remote = remoteList.find(r => r.identifier === remoteName);
    const firstRepo = remote && remote.contents[0].name;
    return this.assignDown('gitRepoName', firstRepo);
    //TODO dockerfile path
  }
}

export default class Gulper{

  constructor(){
    const gitRemoteName = new GitRemoteNameSetter();
    const gitRemoteList = new GitRemoteListSetter({gitRemoteName});
    this.master = new Setter({
      gitRemoteList,
      gitRemoteName
    });
  }

  assign(key, value, bundle){
    this.master.update(key, value, bundle);
    const result = this.master.produce();
    console.log(result);
    return result;
  }
}