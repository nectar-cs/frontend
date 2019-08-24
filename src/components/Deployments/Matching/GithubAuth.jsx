import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import Backend from '../../../utils/Backend';
import s from './GithubAuth.sass';
import MiscUtils from '../../../utils/MiscUtils';
import { ROUTES } from '../../../containers/RoutesConsts';
import { NavLink } from 'react-router-dom';
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";

const GIT_STATES = {
  OFFERING: 'offer',
  AUTHORIZING: 'waiting',
  AUTHORIZED: 'all-set',
  EXITING: 'exiting'
};

export default class GithubAuth extends React.Component {

  static propTypes = {
    authUrl: PropTypes.string,
    notifyGithubConcluded: PropTypes.func.isRequired
  };

  constructor(props){
    super(props);
    this.state = {
      githubState: GIT_STATES.OFFERING,
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
      return <CenterLoader/>
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
      <Fragment>
        <img className={s.containerImage} src={gitLogo} alt={'Github'}/>
        <a onClick={this.onOpenAuthClicked} href={this.props.authUrl} target="_blank">
          <h4 className={s.containerTextTitle}>Connect your Github</h4>
        </a>
        <a onClick={() => this.props.notifyGithubConcluded(false)}>
          <p className={s.containerTextSubtitle}>Or, skip</p>
        </a>
      </Fragment>
    )
  }

  checker(){
    Backend.fetchJson('/github/token', (payload) => {
      if(payload['access_token']){
        this.props.notifyGithubConcluded(true);
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

  static renderContinueLink(){
    return(
      <NavLink to={ROUTES.deployments.detect.path}>
        <i className={`material-icons ${s.containerIcon}`}>check</i>
        <p className={s.containerTextTitle}>All set. Click to continue.</p>
      </NavLink>
    )
  }
};