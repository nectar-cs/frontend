import Authenticate from "../components/Auth/Authenticate";
import LoginAndRegister from "../components/Auth/LoginAndRegister";
import WorkspaceIndex from "../components/Workspaces/Index/WorkspaceIndex";
import WorkspaceEdit from "../components/Workspaces/Edit/WorkspaceEdit";
import WorkspaceShow from "../components/Workspaces/Show/WorkspaceShow";
import DeploymentShow from "../components/Deployments/Show/DeploymentShow";
import InfraDebug from "../components/InfraDebug/InfraDebug";
import BulkMatch from "../components/BulkMatch/BulkMatch";
import Welcome from "../components/Welcome/Welcome";
import DefaultWorkspace from "../components/Deployments/Default/Default";
import Logout from "../components/Auth/Logout";

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

  welcome: {
    index: { path: '/welcome', comp: Welcome }
  },

  workspaces: {
    index: { path: '/workspaces', comp: WorkspaceIndex},
    new: { path: '/workspaces/new', comp: WorkspaceEdit },
    default: { path: '/workspaces/default', comp: DefaultWorkspace },
    edit: { path: '/workspaces/:id/edit', comp: WorkspaceEdit },
    show: { path: '/workspaces/:id', comp: WorkspaceShow }
  },

  auth: {
    authenticate: { path: '/auth/authenticate', comp: Authenticate },
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