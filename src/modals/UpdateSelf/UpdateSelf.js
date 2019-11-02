import React, {Fragment} from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import ModalButton from "../../widgets/Buttons/ModalButton";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";

export default class UpdateSelf extends React {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      isSubmitting: false,
      isPolling: false,
      comparisons: []
    };
  }

  render(){
    return(
      <FlexibleModal mode='modal'>
        { this.renderHeader() }
        { this.renderExplanation() }
        { this.renderButton() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    return(
      <LeftHeader
        graphicName='cached'
        graphicType='icon'
        title='Self Update'
        subtitle="Let me become my ultimate self"
      />
    )
  }

  renderExplanation(){
    return(
      <Fragment>
        <TextOverLineSubtitle text="What's going on?"/>
      </Fragment>
    )
  }

  renderButton(){
    return(
      <ModalButton
        callback={}
        title='Update'
      />
    )
  }

  submit(){

  }
}