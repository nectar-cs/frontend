import Kapi from "../../../utils/Kapi";
import DataUtils from "../../../utils/DataUtils";

class Image {
  initiateImageOperation(){
    const ep = `/api/run/${this.imageOperationVerb()}`;
    const payload = this.imageOperationPayload();
    return Kapi.blockingPost(ep, payload);
  }

  imageOperationPayload(){
    return DataUtils.obj2Snake({
      depNamespace: this.deployment.namespace,
      depName: this.deployment.name,
    });
  }

  imageOperationVerb(){
    return "";
  }

  async fetchPods() {
    const {name, namespace} = this.deployment;
    const ep = `/api/deployments/${namespace}/${name}/pods`;
    return DataUtils.obj2Snake((await Kapi.blockingFetch(ep)))['data'];
  }

}