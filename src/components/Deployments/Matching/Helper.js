import DataUtils from "../../../utils/DataUtils";
import Backend from "../../../utils/Backend";
import { toast } from 'react-toastify';

export default class Helper{

  static matching2Bundle(matching){
    return {
      gitRemoteName: matching.gitRemoteName,
      gitRepoName: matching.gitRepoName,
      imgRemoteName: matching.imgRemoteName,
      imgRepoName: matching.imgRepoName,
      framework: matching.framework,
      dfPath: matching.dockerfilePath
    };
  }

  static makePayload(deployment){
    const {gitRemoteName, gitRepoName} = deployment;
    const {imgRemoteName, imgRepoName} = deployment;
    const {name, dfPath, framework} = deployment;

    const payload = {
      deployment: name, dockerfilePath: dfPath,
      gitRemoteName, gitRepoName,
      imgRemoteName, imgRepoName,
      framework
    };

    return DataUtils.objKeysToSnake(payload);
  }

  static submitSingle(inst){
    const { name } = inst.props.deployment;
    inst.setState((s) => ({...s, isSubmitting: true}));
    const deployment = { ...inst.state.bundle, name };
    const payload = { data: [this.makePayload(deployment)] };
    Backend.raisingPost(`/microservices`, payload, () => this.reload(inst));
  }

  static submitDelete(inst){
    const ep = `/microservices/${inst.state.matchingId}`;
    inst.setState((s) => ({...s, isSubmitting: true}));
    Backend.raisingDelete(ep, () => this.reload(inst));
  }

  static reload(inst){
    inst.setState((s) => ({...s, isSubmitting: false}));
    this.fetchMatching(inst);
    this.notifySubscribers(inst);
  }

  static notifySubscribers(inst){
    const broadcast = inst.props.refreshCallback;
    if(broadcast) broadcast();
  }

  static fetchMatching(inst){
    const { name } = inst.props.deployment;
    const ep = `/microservices/${name}`;
    Backend.raisingFetch(ep, resp => {
      const matching = DataUtils.objKeysToCamel(resp)['data'];
      const merger = this.matching2Bundle(matching);
      const bundle = { ...inst.state.bundle, ...merger };
      const matchingId = matching.id;
      inst.setState(s => ({...s, bundle, matchingId }));
    }, () => {
      inst.setState(s => ({...s, matchingId: null }));
    });
  }

  static showNeg(inst){
    if(inst.props.mode === 'tutorial'){
      return true;
    } else {
      const { matchingId } = inst.state;
      return (matchingId) ? true : null;
    }
  }

  static isLoading(inst){
    const { isGitFetching, isDockerFetching } = inst.state;
    const { isSubmitting, isPathsFetching } = inst.state;
    return isGitFetching || isDockerFetching || isSubmitting || isPathsFetching;
  }
}