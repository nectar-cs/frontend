import GithubAuth from "../components/Team/GithubAuth/GithubAuth";
import Login from "../components/Auth/Login";
import Authenticate from "../components/Auth/Authenticate";
import DeploymentCard from "../components/Deployments/Index/DeploymentCard";
import DeploymentIndex from "../components/Deployments/Index/DeploymentIndex";


export const ROUTES = {
  clusters: {
    connect: { path: '/clusters/connect', comp: null }
  },

  deployments: {
    index: { path: '/sysObjects/index', comp: DeploymentIndex },
    detect: { path: '/sysObjects/detect', comp: DeploymentCard },
  },

  auth: {
    authenticate: { path: '/auth/authenticate', comp: Authenticate },
    login: { path: '/auth/login', comp: Login }
  },

  team: {
    githubAuth: { path: '/teams/githubAuth', comp: GithubAuth }
  },
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