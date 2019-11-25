//@flow
import type {Deployment} from "../../types/Types";

export default class Interpolation{

  static inflateDeployment(deployment: Deployment){
    return {
      d: deployment.name,
      ns: deployment.namespace,
      cont: deployment.containerName
    }
  }

}

