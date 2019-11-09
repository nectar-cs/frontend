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

  static async postWorkspace(workspace: Workspace){
    const ep = `/workspaces/${workspace.id}`;
    const idLessPayload = DataUtils.objWithout(workspace, ['id']);
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

  static async fetchDeployments(filterBundle){
    const ns = props.namespaces;
    const nsFilterType = `ns_filter_type=${ns.filterType}`;
    const nsFilter = `ns_filters=${ns.filters.join(',')}`;

    const lb = props.labels;
    const lbFilterType = `lb_filter_type=${lb.filterType}`;
    const lbFilter = `lb_filters=${lb.filters.join(',')}`;

    const base = '/api/deployments/filtered';
    const args = `${nsFilterType}&${nsFilter}&${lbFilterType}&${lbFilter}`;
    const endpoint = `${base}?${args}`;

    this.setState(s => ({...s, isFetching: true}));
    Kapi.fetch(endpoint, (response) => {
      this.setState((s) => ({...s, deployments: response['data']}));
      this.setState(s => ({...s, isFetching: false}));
    });
  }

}

