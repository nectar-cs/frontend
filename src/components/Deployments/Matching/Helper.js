import DataUtils from "../../../utils/DataUtils";
import Backend from "../../../utils/Backend";

export default class Helper{

  static matching2Bundle(matching){
    return {
      gitRemoteName: matching.gitRemoteName,
      gitRepoName: matching.gitRepoName,
      imgRemoteName: matching.imgRemoteName,
      imgRepoName: matching.imgRepoName,
      framework: matching.framework
    };
  }

  static makePayload(deployment){
    const {gitRemoteName, gitRepoName} = deployment;
    const {imgRemoteName, imgRepoName} = deployment;
    const {name, namespace, framework} = deployment;
    const namespaces = deployment.namespaces || [namespace];

    const payload = {
      deployment: name, namespaces,
      gitRemoteName, gitRepoName,
      imgRemoteName, imgRepoName,
      framework
    };

    return DataUtils.objKeysToSnake(payload);
  }

  static submitMulti(inst, deps){
    inst.setState((s) => ({...s, isSubmitting: true}));
    let payload = deps.map((dep) => this.makePayload(dep));
    payload = { data: payload };

    Backend.raisingPost(`/microservices`, payload, () => {
      inst.setState((s) => ({...s,
        isSubmitting: false,
        areAllSubmitted: true
      }));
    });
  }

  static submitSingle(inst){
    const {name, namespace} = inst.props.deployment;
    const deployment = { ...inst.state.bundle, name, namespace };
    const payload = { data: [this.makePayload(deployment)] };
    console.log("SEND");
    console.log(payload);
    Backend.raisingPost(`/microservices`, payload, () => {
      this.fetchMatching(inst);
    });
  }

  static submitDelete(inst, asd){}

  static fetchMatching(inst){
    const { name, namespace } = inst.props.deployment;
    const ep = `/microservices/${namespace}/${name}`;
    Backend.raisingFetch(ep, resp => {
      const matching = DataUtils.objKeysToCamel(resp)['data'];
      const merger = this.matching2Bundle(matching);
      const bundle = { ...inst.state.bundle, ...merger };
      const matchingId = matching.id;
      inst.setState(s => ({...s, bundle, matchingId }));
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
}