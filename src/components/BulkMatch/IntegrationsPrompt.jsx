//@flow
import React from 'react';
import S from './IntegrationsPromptStyles'
import defaults from './defaults'
import IntegrationsModal from "../../modals/IntegrationsModal/IntegrationsModal";
import {Button} from "nectar-cs-js-common";
import ModalClientComposer from "../../hocs/ModalClientComposer";

class IntegrationsPromptClass extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.showOffer = this.showOffer.bind(this);
  }

  render(){
    return(
      <S.ConnectContainer>
        <S.InnerBox>
          <S.Text>{defaults.integration.reason}</S.Text>
          <S.ContainerIcon className='material-icons'>extension</S.ContainerIcon>
          <S.Text>{defaults.integration.skip}</S.Text>
          <S.Buttons>
            { this.renderSkipButton() }
            { this.renderConnectButton() }
          </S.Buttons>
        </S.InnerBox>
      </S.ConnectContainer>
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
