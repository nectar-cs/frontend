//@flow
import React, { Fragment } from 'react';
import s from './GithubAuth.sass';
import defaults from './defaults'
import IntegrationsModal from "../../modals/IntegrationsModal/IntegrationsModal";
import Button from "../../assets/buttons";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import ModalClientComposer from "../../hocs/ModalClientComposer";

class IntegrationsPromptClass extends React.Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      isDone: false,
      isChecking: false,
    };
  }

  render(){
    return(
      <Fragment>
        { this.renderPrompting() }
        { this.renderDone() }
      </Fragment>
    )
  }

  renderDone(){
    if(!this.state.isDone) return null;
    return(
      <CenterAnnouncement
        text={"Done. Resume Matching."}
        contentType='action'
        iconName='check'
        action={this.props.callback(true)}
      />
    )
  }

  renderPrompting(){
    if(this.state.isDone) return null;
    const skip = () => this.props.callback(false);
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

  showOffer(){
    this.props.openModal(IntegrationsModal, {});
  }
}

type Props = { callback: (boolean, {}) => string };

const IntegrationPrompt = ModalClientComposer.compose(
  IntegrationsPromptClass
);

export default IntegrationPrompt;
