import LoginAndRegister from "../Auth/LoginAndRegister";
import WorkspaceIndex from "../Workspaces/Index/WorkspaceIndex";
import WorkspaceEdit from "../Workspaces/Edit/WorkspaceEdit";
import WorkspaceShow from "../Workspaces/Show/WorkspaceShow";
import DeploymentShow from "../Deployments/Show/DeploymentShow";
import InfraDebug from "../InfraDebug/InfraDebug";
import BulkMatch from "../BulkMatch/BulkMatch";
import DefaultWorkspace from "../Deployments/Default/Default";
import Logout from "../Auth/Logout";

export const ROUTES = {
  clusters: {
    connect: { path: '/clusters/connect', comp: null }
  },

  deployments: {
    debug: { path: '/deployments/:ns/:id/debug/:type', comp: InfraDebug },
    show: { path: '/deployments/:ns/:id', comp: DeploymentShow },
  },

  bulkMatch: {
    index: { path: '/bulk-matching', comp: BulkMatch },
  },

  workspaces: {
    index: { path: '/workspaces', comp: WorkspaceIndex},
    new: { path: '/workspaces/new', comp: WorkspaceEdit },
    default: { path: '/workspaces/default', comp: DefaultWorkspace },
    edit: { path: '/workspaces/:id/edit', comp: WorkspaceEdit },
    show: { path: '/workspaces/:id', comp: WorkspaceShow }
  },

  auth: {
    login: { path: '/auth/login', comp: LoginAndRegister },
    register: { path: '/auth/register', comp: LoginAndRegister },
    logout: { path: '/auth/logout', comp: Logout }
  }
};

export function makeRoute(route, subs){
  Object.keys(subs).forEach((key) => {
    route = route.replace(`:${key}`, subs[key]);
  });
  return route;
}

export function routes(){
  return ROUTES;
}