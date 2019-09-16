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
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ModalHostComposer from "../../../hocs/ModalHostComposer";

const PHASES = {
  OFFERING: 'offer',
  AUTHORIZING: 'waiting',
  DONE: 'all-set',
  EXITING: 'exiting'
};

const IntegrationsPromptClass = class extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      githubState: PHASES.OFFERING
    };
    this.onIntegrationsChanged = this.onIntegrationsChanged.bind(this);
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Fragment>
          { this.renderContinueLink() }
          { this.renderPrompting() }
        </Fragment>
      </ThemeProvider>
    )
  }

  onIntegrationsChanged(){
    console.log("RELOAD TIME");
    IntegrationsPromptClass.checkGitOrDocker(done => {

    })
  }

  renderPrompting(){
    if(this.state.githubState !== PHASES.OFFERING) return null;
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
    this.setState(s => ({...s, githubState: PHASES.OFFERING}));
    const bundle = { onClosed: this.onIntegrationsChanged };
    this.props.openModal(IntegrationsModal, bundle);
  }


  renderContinueLink(){
    if(this.state.githubState === PHASES.DONE){
      return(
        <NavLink to={ROUTES.deployments.detect.path}>
          <i className={`material-icons ${s.containerIcon}`}>check</i>
          <p className={s.containerTextTitle}>All set. Click to continue.</p>
        </NavLink>
      )
    }
  }

  static checkGitOrDocker(whenDone){
    whenDone(true);
  }

  static propTypes = {
    notifyGithubConcluded: PropTypes.func.isRequired,
  };
};

const IntegrationPrompt = ModalHostComposer.compose(
  IntegrationsPromptClass
);

export { IntegrationPrompt as default };
