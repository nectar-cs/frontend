import React from 'react'
import s from './HttpActionsModal.sass'
import {FULL_DEPLOYMENT} from "../../types/Deployment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import LeftRightHeaders from "./LeftRightHeaders.js";
import Tabs from "../../widgets/Tabs/Tabs";
import DestinationPane from "./DestinationPane";
import SourcePane from "./SourcePane";
import KubeHandler from "../../utils/KubeHandler";

const REQUEST_TAB_NAMES = ['Destination', 'Source', 'Headers', 'Body'];

export default class HttpActionsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      destination: {
        host: null,
        path: null,
        verb: 'GET'
      },
      source: {
        type: 'test-pod',
        namespace: props.deployment.namespace
      },
      namespaces: []
    }
  }

  componentDidMount(){
    KubeHandler.raisingFetch('/api/cluster/namespaces', (resp) => {
      this.setState(s => ({...s, namespaces: resp['data'] }))
    });
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
    const srcCallback = (asg) => this.onGroupFieldChanged('source', asg);

    return(
      <Tabs tabs={REQUEST_TAB_NAMES} selectedInd={1}>
        <DestinationPane
          onFieldChanged={destCallback}
          services={this.props.deployment.services}
          {...this.state.destination}
        />
        <SourcePane
          onFieldChanged={srcCallback}
          namespaces={this.state.namespaces}
          {...this.state.source}
        />
        <p>Otre</p>
        <p>for</p>
      </Tabs>
    )
  }

  onGroupFieldChanged(group, assignment){
    const newDestination = {...this.state[group], ...assignment};
    this.setState(s => ({...s, [group]: newDestination}));
  }

  assessReadiness(){
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

