import Backend from "../../../utils/Backend";
import DataUtils from "../../../utils/DataUtils";
import Kapi from "../../../utils/Kapi";

export default class Helper{

  static fetchDeployments(inst, show, source){
    const { workspace } = source || inst.props;
    show && inst.setState((s) => ({...s, isFetching: true}));

    const onSuccess = (deployments) =>  {
      inst.setState((s) => ({...s, deployments}));
      inst.setState((s) => ({...s, isFetching: false}));
    };

    Kapi.filterFetch('/api/deployments', workspace, r => {
      onSuccess(DataUtils.objKeysToCamel(r['data']));
    }, inst.props.kubeErrorCallback);
  }

  static fetchMatchings(inst){
    Backend.raisingFetch(`/microservices`, resp => {
      const matchings = DataUtils.objKeysToCamel(resp).data;
      inst.setState(s => ({...s, matchings}));
    }, inst.props.apiErrorCallback);
  }

  static workspace(inst){
    return inst.props.workspace;
  }
}