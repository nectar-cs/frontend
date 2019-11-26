//@flow
import type {Deployment} from "../../types/Types";
import Utils from "../../utils/Utils";

export default class Interpolation{

  static inflateDeployment(deployment: Deployment){
    return {
      d: deployment.name,
      ns: deployment.namespace,
      cont: deployment.containerName,
      sel: Utils.labelsToEqStr(deployment.selectorLabels)
    }
  }

}

