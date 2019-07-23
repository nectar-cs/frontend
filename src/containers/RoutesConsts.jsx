import GithubAuth from "../components/Deployments/Matching/GithubAuth";
import Login from "../components/Auth/Login";
import Authenticate from "../components/Auth/Authenticate";
import DeploymentIndex from "../components/Deployments/Index/DeploymentIndex";
import Matching from "../components/Deployments/Matching/Matching";

export const ROUTES = {
  clusters: {
    connect: { path: '/clusters/connect', comp: null }
  },

  deployments: {
    index: { path: '/deployments/index', comp: DeploymentIndex },
    detect: { path: '/deployments/detect', comp: Matching },
  },

  auth: {
    authenticate: { path: '/auth/authenticate', comp: Authenticate },
    login: { path: '/auth/login', comp: Login }
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