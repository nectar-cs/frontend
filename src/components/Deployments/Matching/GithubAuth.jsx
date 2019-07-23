import React, { Fragment } from 'react';
import Backend from '../../../utils/Backend';
import s from './GithubAuth.sass';
import ls from './../../../assets/loading-spinner.sass'
import MiscUtils from '../../../utils/MiscUtils';
import AuthenticatedComponent from '../../../hocs/AuthenticatedComponent';
import { ROUTES } from '../../../containers/RoutesConsts';
import { NavLink } from 'react-router-dom';

const GIT_STATES = {
  OFFERING: 'offer',
  AUTHORIZING: 'waiting',
  AUTHORIZED: 'all-set',
  EXITING: 'exiting'
};

export default class GithubAuth extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      githubState: GIT_STATES.OFFERING,
      authUrl: null
    };

    this.onOpenAuthClicked = this.onOpenAuthClicked.bind(this);
    this.renderGitOffer = this.renderGitOffer.bind(this);
  }

  render(){
    return(
      <div className={s.connectContainer}>
        <div className={s.innerBox}>
          { this.centerContent() }
        </div>
      </div>
    )
  }

  centerContent(){
    if(this.state.githubState === GIT_STATES.AUTHORIZED){
      return GithubAuth.renderContinueLink();
    } else if(this.state.githubState === GIT_STATES.AUTHORIZING){
      return GithubAuth.renderLoading("Waiting on Github.");
    } else if(this.state.githubState === GIT_STATES.OFFERING) {
      return this.renderGitOffer()
    } else if(this.state.githubState === GIT_STATES.CHECKING) {
      return <p>Checking...</p>;
    } return GithubAuth.renderLoading("Loading.");
  }

  componentDidMount(){
    if(this.state.githubState !== GIT_STATES.CHECKING) return;

    Backend.fetchJson('/github/token', (payload) => {
      if(payload['access_token']){
        this.setState((s) => ({...s, githubState: GIT_STATES.AUTHORIZED}));
        this.fetchClusterDeploys();
      } else {
        this.setState((s) => ({...s,
          githubState: GIT_STATES.OFFERING,
          authUrl: payload['auth_url']
        }));
      }
    });
  }

  renderGitOffer(){
    const gitLogo = MiscUtils.frameworkImage2('github', 'original.svg');
    return(
      <a
        onClick={this.onOpenAuthClicked}
        href={this.state.authUrl}
        target="_blank">
        <img className={s.containerImage} src={gitLogo} alt={'Github'}/>
        <p className={s.containerText}>Connect your Github</p>
      </a>
    )
  }

  checker(){
    Backend.fetchJson('/github/token', (payload) => {
      if(payload['access_token']){
        this.setState((s) => ({...s, githubState: GIT_STATES.AUTHORIZED}));
      } else this.pollBackend();
    });
  };

  pollBackend(){
    setTimeout(this.checker.bind(this), 2000);
  }

  onOpenAuthClicked(){
    this.setState((s) => ({...s, githubState: GIT_STATES.AUTHORIZING}));
    this.pollBackend();
  }

  static renderLoading(text){
    return(
      <Fragment>
        <div className={`${ls.centLoadingSpinner} ${s.loader}`}/>
        <p className={s.containerText}>{text}</p>
      </Fragment>
    )
  }

  static renderContinueLink(){
    return(
      <NavLink to={ROUTES.deployments.detect.path}>
        <i className={`material-icons ${s.containerIcon}`}>check</i>
        <p className={s.containerText}>All set. Click to continue.</p>
      </NavLink>
    )
  }
};