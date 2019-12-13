//@flow
import Setter from '../../utils/StateGulp';
import type { RemoteBundle, RemoteRepo } from '../../types/Types';
import Helper from './Helper';

const StringSimilarity = require('string-similarity');

class DeploymentNameSetter extends Setter {
  sideEffects(bundle): {} {
    const { gitRemoteList, imgRemoteList } = bundle;
    return { gitRemoteList, imgRemoteList };
  }
}

class GitAndImgSetter extends Setter {
  constructor(type: 'git' | 'img', ...defaultArgs) {
    super(...defaultArgs);
    this.type = type;
  }

  remoteList(bundle): RemoteBundle[] {
    return bundle[`${this.type}RemoteList`];
  }
}

class GitRemoteListSetter extends GitAndImgSetter {

  remoteIdentifier(firstRemote){
    const key = `${this.type}RemoteName`;
    return { [key]: firstRemote.identifier };
  }

  sideEffects(bundle) {
    const remoteList: Array<RemoteBundle> = this._value || [];
    const firstRemote: RemoteBundle = remoteList[0];
    return firstRemote && this.remoteIdentifier(firstRemote);
  }
}

class RemoteNameSetter extends GitAndImgSetter {
  guessRepo(target: string, options: string[]) {
    if (target && options.length > 0) {
      const sorting = StringSimilarity.findBestMatch(target, options);
      return options[sorting.bestMatchIndex];
    } else return null;
  }

  sideEffects(bundle) {
    const remoteName: string = this._value;
    const remoteList: Array<RemoteBundle> = this.remoteList(bundle);
    const repoNames = Helper.repoOptions(remoteList, remoteName);
    const repoGuess = this.guessRepo(bundle.deploymentName, repoNames);
    return { [`${this.type}RepoName`]: repoGuess || '' };
  }
}

class RepoNameSetter extends GitAndImgSetter {
  repoObject(bundle): RemoteRepo {
    const { gitRepoName, gitRemoteList, gitRemoteName } = bundle;
    return Helper.selectedRepo(gitRemoteList, gitRemoteName, gitRepoName);
  }

  firstDockerfilePath(bundle): ?string {
    const key = `${bundle.gitRemoteName}_${this._value}`;
    const paths = bundle.dfPathDict[key];
    if (paths != null) {
      return paths[0];
    } else if (bundle.gitRemoteName && this._value) {
      bundle.fetchDfPaths(bundle.gitRemoteName, this._value);
      return null;
    }
  }

  sideEffects(bundle) {
    if (this.type === 'git') {
      const framework = (this.repoObject(bundle) || {}).framework || '';
      const dockerfilePath = this.firstDockerfilePath(bundle) || '';
      return { framework, dockerfilePath };
    } else return {};
  }
}

class DfPathDictSetter extends Setter {
  sideEffects(bundle) {
    const newDict = this._value;
    const { gitRemoteName, gitRepoName } = bundle;
    const pathList = newDict[`${gitRemoteName}_${gitRepoName}`];
    if (pathList && pathList.length > 0) return { dockerfilePath: pathList[0] };
    else return {};
  }
}

class DfPathSetter extends Setter {
  sideEffects(bundle) {
    const { dockerfilePath } = bundle;
    const dockerBuildPath = (dockerfilePath || '').replace('Dockerfile', '');
    return { dockerBuildPath };
  }
}

export default class Gulper {
  constructor() {
    this.consumable = {};
    const dockerfilePath = new DfPathSetter();
    const dfPathDict = new DfPathDictSetter({ dockerfilePath });

    const gitRepoName = new RepoNameSetter('git');
    const gitRemoteName = new RemoteNameSetter('git', { gitRepoName });
    const gitRemoteList = new GitRemoteListSetter('git', { gitRemoteName });

    const imgRepoName = new RepoNameSetter('img');
    const imgRemoteName = new RemoteNameSetter('img', { imgRepoName });
    const imgRemoteList = new GitRemoteListSetter('img', { imgRemoteName });

    const deploymentName = new DeploymentNameSetter({
      gitRemoteList,
      imgRemoteList,
    });

    this.master = new Setter({
      deploymentName,
      gitRemoteList,
      gitRemoteName,
      gitRepoName,
      imgRemoteList,
      imgRemoteName,
      imgRepoName,
      dfPathDict,
      dockerfilePath,
    });
  }

  setConsumableMatching(matching) {
    if (matching) {
      const { gitRemoteName, gitRepoName } = matching;
      const { imgRemoteName, imgRepoName } = matching;
      const { dockerfilePath, dockerBuildPath, framework } = matching;
      this.consumable = {
        gitRemoteName,
        gitRepoName,
        imgRemoteName,
        imgRepoName,
        dockerfilePath,
        dockerBuildPath,
        framework,
      };
    } else this.consumable = {};
  }

  assign(key, value, bundle) {
    this.master.update(key, value, bundle, this.consumable);
    return this.master.produce();
  }
}
