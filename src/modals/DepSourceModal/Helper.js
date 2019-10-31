import ImageOpsModal from "../ImageOpsModal/View/ImageOpsModal";
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";
import MiscUtils from "../../utils/MiscUtils";

export default class Helper{
  static goToImageOps(inst){
    const { deployment, matching } = inst.props;
    let bundle = { deployment, matching };
    bundle = {...bundle, operationType: 'git'};
    inst.props.replaceModal(ImageOpsModal, bundle);
  }

  static isAnnotated(inst){
    const commit = inst.props.deployment.commit;
    const { sha } = (commit || {});
    return sha;
  }
  
  static fetchCommit(inst){
    const { deployment, matching } = inst.props;
    inst.setState(s => ({...s, isFetching: true}));
    const ep = MiscUtils.commitDetailPath(deployment, matching);
    Backend.raisingFetch(ep, resp => {
      const commit = DataUtils.obj2Camel(resp['data']);
      inst.setState(s => ({...s, commit, isFetching: false}));
    });
  }
}