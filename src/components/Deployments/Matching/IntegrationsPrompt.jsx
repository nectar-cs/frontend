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
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";

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
      phase: PHASES.OFFERING
    };
    this.onIntegrationsChanged = this.onIntegrationsChanged.bind(this);
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Fragment>
          { this.renderPrompting() }
          { this.renderDone() }
        </Fragment>
      </ThemeProvider>
    )
  }

  onIntegrationsChanged(){
    console.log("RELOAD TIME");
    IntegrationsPromptClass.checkGitOrDocker(done => {
      done && this.setState(s => ({...s, phase: PHASES.DONE}));
    })
  }

  renderDone(){
    if(this.state.phase !== PHASES.DONE) return null;
    return(
      <CenterAnnouncement
        text={"Done. Click to begin Matching."}
        contentType='action'
        iconName='check'
        action={this.props.notifyGithubConcluded(true)}
      />
    )
  }

  renderPrompting(){
    if(this.state.phase !== PHASES.OFFERING) return null;
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
    this.setState(s => ({...s, phase: PHASES.OFFERING}));
    const bundle = { onClosed: this.onIntegrationsChanged };
    this.props.openModal(IntegrationsModal, bundle);
  }

  static checkGitOrDocker(whenDone){
    whenDone(false);
  }

  static propTypes = {
    notifyGithubConcluded: PropTypes.func.isRequired,
  };
};

const IntegrationPrompt = ModalHostComposer.compose(
  IntegrationsPromptClass
);

export { IntegrationPrompt as default };
