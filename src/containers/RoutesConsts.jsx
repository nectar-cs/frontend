import Authenticate from "../components/Auth/Authenticate";
import DeploymentIndex from "../components/Deployments/Index/DeploymentIndex";
import Matching from "../components/Deployments/Matching/Matching";
import LoginAndRegister from "../components/Auth/LoginAndRegister";

export const ROUTES = {
  clusters: {
    connect: { path: '/clusters/connect', comp: null }
  },

  deployments: {
    index: { path: '/deployments/index', comp: DeploymentIndex },
    detect: { path: '/deployments/detect', comp: Matching },
  },

  workspaces: {
    index: { path: '/workspaces/' },
    show: { path: '/workspaces/:id' }
  },

  auth: {
    authenticate: { path: '/auth/authenticate', comp: Authenticate },
    login: { path: '/auth/login', comp: LoginAndRegister },
    register: { path: '/auth/register', comp: LoginAndRegister }
  }
};

export const SUBS = {
  ID: 'id',
  CONCERN: 'concern'
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