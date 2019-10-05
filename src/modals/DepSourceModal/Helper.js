import ImageActionsModal from "../ImageActionsModal/ImageActionsModal";

export default class Helper{
  static goToImageOps(inst){
    const { deployment, matching } = inst.props;
    let bundle = { deployment, matching };
    bundle = {...bundle, operationType: 'git'};
    inst.props.replaceModal(ImageActionsModal, bundle);
  }

  static isAnnotated(inst){
    const { statedBranch, statedCommit } = inst.props.deployment;
    return statedBranch && statedCommit;
  }

}