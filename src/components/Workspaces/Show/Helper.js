import Backend from "../../../utils/Backend";
import DataUtils from "../../../utils/DataUtils";
import Kapi from "../../../utils/Kapi";

export default class Helper{
  static fetchDeployments(inst, source){
    const {workspace} = source || inst.props;
    Kapi.filterFetch('/api/deployments', workspace, r => {
      const deployments = DataUtils.objKeysToCamel(r)['data'];
      inst.setState((s) => ({
        ...s,
        deployments,
        isFetching: false
      }));
    }, inst.props.kubeErrorCallback);
  }


  static fetchMatchings(inst){
    Backend.raisingFetch(`/microservices`, resp => {
      const microservices = DataUtils.objKeysToCamel(resp).data;
      inst.setState(s => ({...s, microservices}));
    });
  }

  static workspace(inst){
    return inst.props.workspace;
  }
}