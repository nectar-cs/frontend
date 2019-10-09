import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import s from './GithubAuth.sass';
import defaults from './defaults'
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";
import IntegrationsModal from "../../../modals/IntegrationsModal/IntegrationsModal";
import Button from "../../../assets/buttons";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import CenterAnnouncement from "../../../widgets/CenterAnnouncement/CenterAnnouncement";
import Backend from "../../../utils/Backend";

const IntegrationsPromptClass = class extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isDone: false,
      isChecking: false,
    };
    this.checkIntegrationState = this.checkIntegrationState.bind(this);
  }

  componentDidMount(){
    this.setState(s => ({...s, isChecking: true}));
    this.checkIntegrationState();
  }

  render(){
    return(
      <Fragment>
        { this.renderChecking() }
        { this.renderPrompting() }
        { this.renderDone() }
      </Fragment>
    )
  }

  renderDone(){
    if(!this.state.isDone) return null;
    return(
      <CenterAnnouncement
        text={"Done. Click to begin Matching."}
        contentType='action'
        iconName='check'
        action={this.props.notifyIntegrationDone(true)}
      />
    )
  }

  renderChecking(){
    if(!this.state.isChecking) return null;
    return <CenterLoader/>;
  }

  renderPrompting(){
    if(this.state.isChecking || this.state.isDone) return null;
    const skip = () => this.props.notifyIntegrationDone(false);
    const cont = () => this.showOffer();

    return(
      <div className={s.connectContainer}>
        <div className={s.innerBox}>
          <p className={s.text}>{defaults.integration.reason}</p>
          <i className={`${s.containerIcon} material-icons`}>extension</i>
          <p className={s.text}>{defaults.integration.skip}</p>
          <div className={s.buttons}>
            <Button.FixedSmallButton emotion={'idle'} onClick={skip}>
              Skip
            </Button.FixedSmallButton>
            <Button.FixedSmallButton onClick={cont}>
              Connect
            </Button.FixedSmallButton>
          </div>
        </div>
      </div>
    )
  }

  checkIntegrationState(){
    IntegrationsPromptClass.checkGitOrDocker((done, hash) => {
      if(done) this.props.notifyIntegrationDone(true, hash);
      else this.setState(s => ({...s, isChecking: false}));
    })
  }

  showOffer(){
    const bundle = { onClosed: this.checkIntegrationState };
    this.props.openModal(IntegrationsModal, bundle);
  }

  static checkGitOrDocker(callback){
    Backend.raisingFetch(`/remotes/connected?entity=git`, git => {
      Backend.raisingFetch(`/remotes/connected?entity=docker`, docker => {
        const hasGitRemote = git.data.length > 0;
        const hasImageRegistry = docker.data.length > 0;
        const done = hasGitRemote || hasImageRegistry;
        callback(done, {hasGitRemote, hasImageRegistry});
      });
    })
  }

  static propTypes = {
    notifyIntegrationDone: PropTypes.func.isRequired,
  };
};

const IntegrationPrompt = ModalHostComposer.compose(
  IntegrationsPromptClass
);

export { IntegrationPrompt as default };
