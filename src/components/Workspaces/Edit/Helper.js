import Kapi from "../../../utils/Kapi";
import DataUtils from "../../../utils/DataUtils";
import Backend from "../../../utils/Backend";
import type {Workspace} from "../../../types/Types";

export default class Helper {

  static CORE_WORKSPACE_FIELDS = [
    'nsFilters', 'lbFilters', 'nsFilterType', 'lbFilterType'
  ];

  static async fetchNamespaces(): string[] {
    return await Kapi.bFetch('/api/cluster/namespaces');
  }

  static async fetchLabels(): string[] {
    return await Kapi.bFetch('/api/cluster/label_combinations');
  }

  static async fetchWorkspace(id: number): Workspace{
    return await Backend.bFetch(`/workspaces/${id}`);
  }

  static async patchOrPostWorkspace(workspace: Workspace){
    const ep = `/workspaces/${workspace.id ? workspace.id : ''}`;
    const idLessPayload = DataUtils.objWithout(workspace, ['id']);
    if(workspace.id)
      return await Backend.bPatch(ep, idLessPayload);
    else
      return await Backend.bPost(ep, idLessPayload);
  }

  static coreWorkspace(workspace){
    return DataUtils.pluck(workspace, this.CORE_WORKSPACE_FIELDS);
  }

  static deploymentsNeedReload(changes, prevWorkspace){
    const nsChanged = Object.keys(changes).includes('namespaces');
    const lbChanged = Object.keys(changes).includes('labels');
    if(nsChanged || lbChanged) return true;

    if(Object.keys(changes).includes('workspace')){
      const coreOldWorkspace = this.coreWorkspace(prevWorkspace);
      const coreNewWorkspace = this.coreWorkspace(changes.workspace);
      return !DataUtils.deepEqual(coreOldWorkspace, coreNewWorkspace);
    }
  }

  static async fetchDeployments(workspace){
    const ep = '/api/deployments';
    const args = Kapi.workspaceToFilterUrlParams(workspace);
    console.log("ARGS --- " + args );
    const url = `${ep}?${args}`;
    return await Kapi.bFetch(url);
  }

}

