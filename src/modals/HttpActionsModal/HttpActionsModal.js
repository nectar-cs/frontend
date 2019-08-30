import React, {Fragment} from 'react'
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
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";

const REQUEST_TAB_NAMES = ['Destination', 'Source', 'Headers', 'Body'];

export default class HttpActionsModal extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      destination: {
        host: HttpActionsModal.defaultHost(props),
        path: '/',
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
      phase: 'editing',
      httpResp: null,
    };

    this.onSubmitted = this.onSubmitted.bind(this);
    this.onSubmitFailed = this.onSubmitFailed.bind(this);
  }

  static defaultHost(props){
    if(props.targetHost){
      return DestinationPane.makeHost(props.targetHost, props.port);
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
    let content = null;
      if(this.state.phase === 'editing')
      content = this.renderEditPhase();
    else if(this.state.phase === 'submitting')
        content = this.renderSubmittingPhase();
    else if(this.state.phase === 'response')
        content = this.renderResponsePhase();

    return(
      <div className={s.modal}>
        <LeftRightHeaders name={this.props.deployment.name}/>
        { content }
      </div>
    )
  }

  renderEditPhase(){
    return(
      <Fragment>
        { this.renderRunButton() }
        { this.renderTabs() }
      </Fragment>
    )
  }

  renderSubmittingPhase(){
    return <CenterLoader/>;
  }

  renderResponsePhase(){
    return (
      <p>
        { this.state.httpResp }
      </p>
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
    if(this.state.source.type !== 'test-pod') return false;

    let blanksPresent = false;
    Object.values(this.state.destination).forEach(v => {
      blanksPresent = blanksPresent || !v;
    });
    return !blanksPresent;
  }

  onSubmitted(response){
    this.setState(s => ({...s,
      phase: 'response',
      httpResp: response['data']
    }));
  }

  onSubmitFailed(bundle){
    this.setState(s => ({...s, phase: 'editing'}));
    console.log("Fook");
    console.log(bundle);
  }

  submit(){
    this.setState(s => ({...s, phase: 'submitting'}));
    const {verb, path, host} = this.state.destination;
    let payload = { verb, url: `${host}${path}`};

    KubeHandler.raisingPost(
      "/api/run/curl",
      payload,
      this.onSubmitted,
      this.onSubmitFailed
    );
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
    targetAddr: PropTypes.string,
    port: PropTypes.number
  }
}