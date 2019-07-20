import GithubAuth from "../components/Team/GithubAuth/GithubAuth";
import Login from "../components/Auth/Login";
import Authenticate from "../components/Auth/Authenticate";


export const ROUTES = {
  clusters: {
    connect: { path: '/clusters/connect', comp: null }
  },
  sysObjects: {
    index: '/sysObjects/index',
    detect: '/sysObjects/detect',
  },
  auth: {
    authenticate: { path: '/auth/authenticate', comp: Authenticate},
    login: { path: '/auth/login', comp: Login }
  },
  team: {
    githubAuth: { path: '/teams/githubAuth', comp: GithubAuth }
  },
  specs: {
    edit: '/specs/:id/edit/:concern'
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