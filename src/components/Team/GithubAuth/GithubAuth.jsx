import React, { Fragment } from 'react';
import WebUtils from '../../../utils/WebUtils';
import s from './GithubAuth.sass';
import ls from './../../../assets/loading-spinner.sass'
import ReactSVG from 'react-svg';
import MiscUtils from '../../../utils/MiscUtils';
import AuthenticatedComponent from '../../../hocs/AuthenticatedComponent';
import { ROUTES } from '../../../containers/RoutesConsts';
import { NavLink } from 'react-router-dom';
import gitLogo from './../../../resources/images/frameworks/github/github-plain.svg'

const GIT_STATES = {
  CHECKING: 'checking',
  OFFERING: 'offer',
  AUTHORIZING: 'waiting',
  AUTHORIZED: 'all-set',
  EXITING: 'exiting'
};

const GithubAuthClass = class extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      githubState: GIT_STATES.CHECKING,
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
      return GithubAuthClass.renderContinueLink();
    } else if(this.state.githubState === GIT_STATES.AUTHORIZING){
      return GithubAuthClass.renderLoading("Waiting on Github.");
    } else if(this.state.githubState === GIT_STATES.OFFERING) {
      return this.renderGitOffer()
    } else if(this.state.githubState === GIT_STATES.CHECKING) {
      return <p>Checking...</p>;
    } return GithubAuthClass.renderLoading("Loading.");
  }

  componentDidMount(){
    if(this.state.githubState !== GIT_STATES.CHECKING) return;
    WebUtils.fetchJson('/github/token', (payload) => {
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
    return(
      <a
        onClick={this.onOpenAuthClicked}
        href={this.state.authUrl}
        target="_blank">
        <ReactSVG
          svgClassName={s.containerImage}
          src={gitLogo}
        />
        <p className={s.containerText}>Connect your Github</p>
      </a>
    )
  }

  checker(){
    WebUtils.fetchJson('/github/token', (payload) => {
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
      <NavLink to={ROUTES.sysObjects.detect}>
        <i className={`material-icons ${s.containerIcon}`}>check</i>
        <p className={s.containerText}>All set. Click to continue.</p>
      </NavLink>
    )
  }
};

const ComposedClass = AuthenticatedComponent.compose(GithubAuthClass);

export default class GithubAuth extends React.Component {
  render(){
    return <ComposedClass {...ComposedClass}/>
  }
}