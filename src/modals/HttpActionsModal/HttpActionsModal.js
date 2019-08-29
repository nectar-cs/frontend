import React from 'react'
import s from './HttpActionsModal.sass'
import {FULL_DEPLOYMENT} from "../../types/Deployment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import LeftRightHeaders from "./LeftRightHeaders.js";
import Tabs from "../../widgets/Tabs/Tabs";

export default class HttpActionsModal extends React.Component {
  render(){
    return(
      <div className={s.modal}>
        <LeftRightHeaders name={this.props.deployment.name}/>
        { this.renderRunButton() }
        { this.renderTabs() }
      </div>
    )
  }

  renderTabs(){
    return <Tabs tabs={['Destination', 'Source', 'Headers', 'Body']}/>
  }

  submit(){
    console.log("Bang!");
  }

  renderRunButton(){
    return(
      <ModalButton
        callback={() => this.submit()}
        title='Run'
      />
    )
  }

  static propTypes = {
    ...FULL_DEPLOYMENT
  }

}