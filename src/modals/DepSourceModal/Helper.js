import ImageActionsModal from "../ImageActionsModal/ImageActionsModal";
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";

export default class Helper{
  static goToImageOps(inst){
    const { deployment, matching } = inst.props;
    let bundle = { deployment, matching };
    bundle = {...bundle, operationType: 'git'};
    inst.props.replaceModal(ImageActionsModal, bundle);
  }

  static isAnnotated(inst){
    const commit = inst.props.deployment.commit;
    const { sha } = (commit || {});
    return sha;
  }
  
  static fetchCommit(inst){
    inst.setState(s => ({...s, isFetching: true}));
    const {gitRemoteId, gitRepoName} = inst.props.matching;
    const { commit } = inst.props.deployment;
    const ep = `/remotes/${gitRemoteId}/${gitRepoName}/commit/${commit.sha}`;
    Backend.raisingFetch(ep, resp => {
      const commit = DataUtils.objKeysToCamel(resp['data']);
      inst.setState(s => ({...s, commit, isFetching: false}));
    });
  }
}