import Backend from "../../../utils/Backend";
import DataUtils from "../../../utils/DataUtils";
import Kapi from "../../../utils/Kapi";

export default class Helper{
  static fetchDeployments(inst){
    Backend.raisingFetch(`/workspaces/${inst.workspaceId()}`, (workspace) => {
      workspace = DataUtils.objKeysToCamel(workspace);
      Kapi.filterFetch('/api/deployments', workspace, (depsResp) => {
        const deployments = DataUtils.objKeysToCamel(depsResp)['data'];
        inst.setState((s) => ({
          ...s,
          workspace,
          deployments,
          isFetching: false
        }));
      }, inst.props.kubeErrorCallback);
    });
  }

  static fetchMatchings(inst){
    Backend.raisingFetch(`/microservices`, resp => {
      const microservices = DataUtils.objKeysToCamel(resp).data;
      inst.setState(s => ({...s, microservices}));
    });
  }
}