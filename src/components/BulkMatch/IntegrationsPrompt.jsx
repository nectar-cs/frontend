//@flow
import React from 'react';
import s from './GithubAuth.sass';
import defaults from './defaults'
import IntegrationsModal from "../../modals/IntegrationsModal/IntegrationsModal";
import {Button} from "ui-common";
import ModalClientComposer from "../../hocs/ModalClientComposer";

class IntegrationsPromptClass extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.showOffer = this.showOffer.bind(this);
  }

  render(){
    return(
      <div className={s.connectContainer}>
        <div className={s.innerBox}>
          <p className={s.text}>{defaults.integration.reason}</p>
          <i className={`${s.containerIcon} material-icons`}>extension</i>
          <p className={s.text}>{defaults.integration.skip}</p>
          <div className={s.buttons}>
            { this.renderSkipButton() }
            { this.renderConnectButton() }
          </div>
        </div>
      </div>
    )
  }

  renderConnectButton(){
    return(
      <Button.FixedSmallButton onClick={this.showOffer}>
        Connect
      </Button.FixedSmallButton>
    )
  }

  renderSkipButton(){
    const { callback, hideSkip } = this.props;
    if(hideSkip) return null;

    return(
      <Button.FixedSmallButton emotion={'idle'} onClick={callback}>
        Skip
      </Button.FixedSmallButton>
    )
  }

  showOffer(){
    this.props.openModal(IntegrationsModal, {
      onDataChanged: () => this.props.callback(true)
    });
  }
}

type Props = {
  callback: (boolean, {}) => string,
  hideSkip: ?boolean
};

const IntegrationPrompt = ModalClientComposer.compose(
  IntegrationsPromptClass
);

export default IntegrationPrompt;
