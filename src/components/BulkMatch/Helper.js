import Backend from "../../utils/Backend";
import Kapi from "../../utils/Kapi";
import type {Matching, WideDeployment} from "../../types/Types";

export default class Helper{

  static async fetchItems(setter) {
    setter({isFetching: true});
    let ep = '/api/deployments/across_namespaces';
    const deployments = await Kapi.bFetch(ep);
    const matchings = await Backend.bFetch('/microservices');
    setter({deployments, matchings, isFetching: false});
  }

  static async fetchIsIntegrated(callback){
    callback({isCheckingIntegration: true});
    const gits = await Backend.bFetch('/remotes/connected?entity=git');
    const docks = await Backend.bFetch('/remotes/connected?entity=docker');
    const isIntegrated = gits.length + docks.length > 0;
    callback({isIntegrated, isCheckingIntegration: false});
  }

  static depMatching(deployment: WideDeployment, matchings: Matching[]): Matching{
    return matchings.find(matching => (
      matching.deploymentName === deployment.name
    ));
  }
}