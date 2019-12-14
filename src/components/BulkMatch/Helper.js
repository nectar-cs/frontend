import Backend from '../../utils/Backend';
import Kapi from '../../utils/Kapi';

export default class Helper {
  static async fetchDeployments(setter) {
    const ep = '/api/deployments/across_namespaces';
    const deployments = await Kapi.bFetch(ep);
    setter({ deployments });
  }

  static async fetchMatchings(setter) {
    const matchings = await Backend.bFetch('/microservices');
    setter({ matchings });
  }

  static async fetchIsIntegrated(callback) {
    callback({ isCheckingIntegration: true });
    const gits = await Backend.bFetch('/remotes/connected?entity=git');
    const docks = await Backend.bFetch('/remotes/connected?entity=docker');
    const isIntegrated = gits.length + docks.length > 0;
    callback({ isIntegrated, isCheckingIntegration: false });
  }
}
