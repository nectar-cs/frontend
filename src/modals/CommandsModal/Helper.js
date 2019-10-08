import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";

export default class Helper {
  static reloadHistory(inst, whenDone) {
    const { name, namespace } = inst.props.deployment;
    let args = `dep_name=${name}&dep_namespace=${namespace}`;
    args = `${args}&kind=commands`;
    Backend.raisingFetch(`/dep_attachments?${args}`, (resp) => {
      whenDone(DataUtils.objKeysToCamel(resp['data']));
    });
  }
}