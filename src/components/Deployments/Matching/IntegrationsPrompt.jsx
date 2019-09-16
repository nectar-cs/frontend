import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import Backend from '../../../utils/Backend';
import s from './GithubAuth.sass';
import MiscUtils from '../../../utils/MiscUtils';
import { ROUTES } from '../../../containers/RoutesConsts';
import { NavLink } from 'react-router-dom';
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";
import IntegrationsModal from "../../../modals/IntegrationsModal/IntegrationsModal";
import {ThemeProvider} from "styled-components";
import {theme} from "../../../assets/constants";
import {FixedSmallButton, SmallButton} from "../../../assets/buttons";

const GIT_STATES = {
  OFFERING: 'offer',
  AUTHORIZING: 'waiting',
  AUTHORIZED: 'all-set',
  EXITING: 'exiting'
};

export default class IntegrationsPrompt extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      githubState: GIT_STATES.OFFERING
    };
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Fragment>
          { this.renderContinueLink() }
          { this.renderWaiting() }
          { this.renderPrompting() }
        </Fragment>
      </ThemeProvider>
    )
  }

  renderWaiting(){
    if(this.state.githubState !== GIT_STATES.AUTHORIZING) return null;
    return(
      <IntegrationsModal
        mode='embedded'
      />
    );
  }

  renderPrompting(){
    if(this.state.githubState !== GIT_STATES.OFFERING) return null;
    const skip = () => this.props.notifyGithubConcluded(false);
    const cont = () => this.showOffer();

    return(
      <div className={s.connectContainer}>
        <div className={s.innerBox}>
          <p className={s.text}>For matching, you need to connect to Git and/or Docker.</p>
          <i className={`${s.containerIcon} material-icons`}>extension</i>
          <p className={s.text}>If you chose to skip, you will proceed to the application.</p>
          <div className={s.buttons}>
            <FixedSmallButton emotion={'idle'} onClick={skip}>Skip</FixedSmallButton>
            <FixedSmallButton onClick={cont}>Connect</FixedSmallButton>
          </div>
        </div></div>
    )
  }

  showOffer(){
    this.setState(s => ({...s, githubState: GIT_STATES.OFFERING}));
    this.props.openModal(IntegrationsModal);
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

  renderContinueLink(){
    if(this.state.githubState === GIT_STATES.AUTHORIZED){
      return(
        <NavLink to={ROUTES.deployments.detect.path}>
          <i className={`material-icons ${s.containerIcon}`}>check</i>
          <p className={s.containerTextTitle}>All set. Click to continue.</p>
        </NavLink>
      )
    }
  }

  static propTypes = {
    notifyGithubConcluded: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired
  };
};