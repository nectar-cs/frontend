import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";

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
}