import React from 'react'
import PropTypes from 'prop-types'
import s from './HttpActionsModal.sass'
import {FULL_DEPLOYMENT} from "../../types/Deployment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import LeftRightHeaders from "./LeftRightHeaders.js";
import Tabs from "../../widgets/Tabs/Tabs";
import DestinationPane from "./DestinationPane";
import SourcePane from "./SourcePane";
import KubeHandler from "../../utils/KubeHandler";
import CodeEditor from "./CodeEditor";
import {defaultBody, defaultHeaders} from "./defaults";

const REQUEST_TAB_NAMES = ['Destination', 'Source', 'Headers', 'Body'];

export default class HttpActionsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      destination: {
        host: HttpActionsModal.defaultHost(props),
        path: '',
        verb: 'GET'
      },
      source: {
        type: 'test-pod',
        namespace: props.deployment.namespace,
        labels: []
      },
      headerText: defaultHeaders,
      bodyText: defaultBody,
      namespaces: [],
      labelCombos: [],
    }
  }

  static defaultHost(props){
    if(props.targetHost){
      return props.targetHost;
    } else {
      if(props.deployment.services[0]){
        const {shortDns, fromPort} = props.deployment.services[0];
        return DestinationPane.makeHost(shortDns, fromPort);
      } else return null;
    }
  }

  componentDidMount(){
    KubeHandler.raisingFetch('/api/cluster/namespaces', (resp) => {
      this.setState(s => ({...s, namespaces: resp['data'] }))
    });

    KubeHandler.raisingFetch('/api/cluster/label_combinations', (resp) => {
      this.setState(s => ({...s, labelCombos: resp['data'] }))
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
    const headCallback = (headerText) => this.setState(s => ({...s, headerText}));
    const bodyCallback = (bodyText) => this.setState(s => ({...s, bodyText}));

    return(
      <Tabs tabs={REQUEST_TAB_NAMES} selectedInd={0}>
        <DestinationPane
          onFieldChanged={destCallback}
          services={this.props.deployment.services}
          {...this.state.destination}
        />
        <SourcePane
          onFieldChanged={srcCallback}
          namespaces={this.state.namespaces}
          labelCombos={this.state.labelCombos}
          {...this.state.source}
        />
        <CodeEditor
          body={this.state.headerText}
          onCodeChanged={headCallback}
        />
        <CodeEditor
          body={this.state.bodyText}
          onCodeChanged={bodyCallback}
        />
      </Tabs>
    )
  }

  onGroupFieldChanged(group, assignment){
    const newDestination = {...this.state[group], ...assignment};
    this.setState(s => ({...s, [group]: newDestination}));
  }

  assessReadiness(){
    if(this.state.source.type !== 'test-pod')
      return false;

    let blanksPresent = false;
    Object.values(this.state.destination).forEach(v => {
      blanksPresent = blanksPresent || !v;
    });

    // noinspection RedundantIfStatementJS
    if(blanksPresent)
      return false;

    return true;
  }

  submit(){
    console.log("Bang!");
  }

  renderRunButton(){
    return(
      <ModalButton
        isEnabled={this.assessReadiness()}
        callback={() => this.submit()}
        title='Run'
      />
    )
  }

  static propTypes = {
    ...FULL_DEPLOYMENT,
    targetHost: PropTypes.string
  }
}