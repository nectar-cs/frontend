import Authenticate from "../components/Auth/Authenticate";
import Matching from "../components/Deployments/Matching/Matching";
import LoginAndRegister from "../components/Auth/LoginAndRegister";
import WorkspaceIndex from "../components/Workspaces/Index/WorkspaceIndex";
import WorkspaceEdit from "../components/Workspaces/Edit/WorkspaceEdit";
import WorkspaceShow from "../components/Workspaces/Show/WorkspaceShow";
import DeploymentShow from "../components/Deployments/Show/DeploymentShow";
import NetworkTest from "../components/Laboratory/NetworkTest";
import InfraDebug from "../components/InfraDebug/InfraDebug";

export const ROUTES = {
  clusters: {
    connect: { path: '/clusters/connect', comp: null }
  },

  deployments: {
    detect: { path: '/deployments/detect', comp: Matching },
    debug: { path: '/deployments/:ns/:id/debug/:type', comp: InfraDebug },
    show: { path: '/deployments/:ns/:id', comp: DeploymentShow }
  },

  workspaces: {
    index: { path: '/workspaces', comp: WorkspaceIndex},
    new: { path: '/workspaces/new', comp: WorkspaceEdit },
    edit: { path: '/workspaces/:id/edit', comp: WorkspaceEdit },
    show: { path: '/workspaces/:id', comp: WorkspaceShow }
  },

  auth: {
    authenticate: { path: '/auth/authenticate', comp: Authenticate },
    login: { path: '/auth/login', comp: LoginAndRegister },
    register: { path: '/auth/register', comp: LoginAndRegister }
  },

  experiments: {
    networkTest: {
      path: '/experiments/network_test/',
      comp: NetworkTest
    }
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