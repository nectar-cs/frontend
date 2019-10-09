import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";
import Kapi from "../../utils/Kapi";

export default class Helper {
  static baseEp(inst){
    const { name, namespace } = inst.props.deployment;
    let args = `dep_name=${name}&dep_namespace=${namespace}`;
    return `/dep_attachments?${args}&kind=commands`;
  }

  static reloadHistory(inst, whenDone) {
    Backend.raisingFetch(this.baseEp(inst), (resp) => {
      whenDone(DataUtils.objKeysToCamel(resp['data']));
    });
  }

  static recordCommand(inst, whenDone){
    const { command } = inst.state.choices;
    const payload = {command, status: 1};
    Backend.raisingPost(this.baseEp(inst), { extras: payload }, resp => (
      whenDone(DataUtils.objKeysToCamel(resp['data']))
    ));
  }

  static deleteCommand(inst, id, whenDone){
    Backend.raisingDelete(`/dep_attachments/${id}`, () => {
      whenDone();
    });
  }

  static submitCommand(inst, whenDone, whenFailed){
    const podNamespace = inst.props.deployment.namespace;
    const { podName, command } = inst.state.choices;
    let payload = {podNamespace, podName, command};
    payload = DataUtils.objKeysToSnake(payload);
    Kapi.post("/api/run/cmd", payload, whenDone, whenFailed)
  }

  static previewCommand(inst){
    const { namespace } = inst.props.deployment;
    const { command, podName } = inst.state.choices;
    return `$ kubectl exec ${command} ${podName} --namespace=${namespace}`
  }

  static hasPods(inst){
    const { deployment } = inst.props;
    const runningPods = deployment.pods.filter(pod => (
      pod.state.toLowerCase() === 'running'
    ));
    return runningPods.length > 0;
  }

  static defaultPod(inst){
    const { deployment } = inst.props;
    return Helper.hasPods(inst) ? deployment.pods[0].name : null;
  }
}