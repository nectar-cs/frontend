import React from 'react'
import s from './HttpActionsModal.sass'
import {FULL_DEPLOYMENT} from "../../types/Deployment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import LeftRightHeaders from "./LeftRightHeaders.js";
import Tabs from "../../widgets/Tabs/Tabs";
import DestinationPane from "./DestinationPane";

const REQUEST_TAB_NAMES = ['Destination', 'Source', 'Headers', 'Body'];

export default class HttpActionsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      destination: {
        host: null,
        path: null,
        verb: 'GET'
      }
    }
  }

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
    const destCallback = (asg) => this.onGroupFieldChanged('destination', asg);

    return(
      <Tabs tabs={REQUEST_TAB_NAMES}>
        <DestinationPane
          {...this.state.destination}
          onFieldChanged={destCallback}
          services={this.props.deployment.services}
        />
        <p>two</p>
        <p>Otre</p>
        <p>for</p>
      </Tabs>
    )
  }

  onGroupFieldChanged(group, assignment){
    const newDestination = {...this.state[group], ...assignment};
    this.setState(s => ({...s, [group]: newDestination}));
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

