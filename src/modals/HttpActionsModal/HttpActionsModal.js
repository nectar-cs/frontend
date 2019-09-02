import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import s from './HttpActionsModal.sass'
import {FULL_DEPLOYMENT} from "../../types/Deployment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import Tabs from "../../widgets/Tabs/Tabs";
import DestinationPane from "./DestinationPane";
import SourcePane from "./SourcePane";
import KubeHandler from "../../utils/KubeHandler";
import CodeEditor from "./CodeEditor";
import {defaultBody, defaultHeaders, sampleOut} from "./defaults";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import TopLoader from "../../widgets/TopLoader/TopLoader";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import {BodyResponseView, HeadersResponseView, RawResponseView} from "./Response";
import HistoryList from "./HistoryList";
import Backend from "../../utils/Backend";

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
      headerText: '',
      bodyText: '',
      namespaces: [],
      labelCombos: [],
      phase: 'editing',
      httpResp: {body: sampleOut},
    };

    this._isMounted = true;
    this.submit = this.submit.bind(this);
    this.onSubmitted = this.onSubmitted.bind(this);
    this.onSubmitFailed = this.onSubmitFailed.bind(this);
    this.enterEditState = this.enterEditState.bind(this);
    this.onHistoryItemSelected = this.onHistoryItemSelected.bind(this);
    this.historyCallback = null;
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
      if(this._isMounted)
        this.setState(s => ({...s, namespaces: resp['data'] }))
    });

    KubeHandler.raisingFetch('/api/cluster/label_combinations', (resp) => {
      if(this._isMounted)
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
        <LeftHeader
          graphicName={MiscUtils.frameworkImage('docker')}
          title={`${this.props.deployment.name} / http`}
          subtitle={'Not connected to Git'}
        />
        { content }
      </div>
    )
  }

  renderEditPhase(){
    return(
      <Fragment>
        { this.renderTabs() }
        { this.renderHistory() }
        { this.renderRunButton() }
      </Fragment>
    )
  }

  renderSubmittingPhase(){
    return <CenterLoader/>;
  }

  renderHistory(){
    const historyCallbackSetter = (cb) => { this.historyCallback = cb; };
    return(
      <HistoryList
        name={this.props.deployment.name}
        namespace={this.props.deployment.namespace}
        onItemSelectedCallback={this.onHistoryItemSelected}
        historyCallbackSetter={historyCallbackSetter}
      />
    )
  }

  renderResponsePhase(){
    return (
      <Fragment>
        <Tabs tabs={['Body', 'Headers', 'Raw']} selectedInd={0}>
          <BodyResponseView body={this.state.httpResp.body}/>
          <HeadersResponseView headers={this.state.httpResp.headers}/>
          <RawResponseView response={this.state.httpResp}/>
        </Tabs>
        { this.renderRunButton() }
      </Fragment>
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
          placeholder={defaultHeaders}
          onCodeChanged={headCallback}
        />
        <CodeEditor
          body={this.state.bodyText}
          placeholder={defaultBody}
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
    if(this.state.phase === 'editing'){
      if(this.state.source.type !== 'test-pod') return false;

      let blanksPresent = false;
      Object.values(this.state.destination).forEach(v => {
        blanksPresent = blanksPresent || !v;
      });
      return !blanksPresent;
    } else return true;
  }

  onSubmitted(response){
    if(this._isMounted){
      this.setState(s => ({...s,
        phase: 'response',
        httpResp: response['data']
      }));

      this.saveToHistory(response['data']['status']);
    }
  }

  onSubmitFailed(bundle){
    if(this._isMounted){
      this.setState(s => ({...s, phase: 'editing'}));

      console.log("Fook");
      console.log(bundle);
    }
  }

  submit(){
    this.setState(s => ({...s, phase: 'submitting'}));
    const {verb, path, host } = this.state.destination;
    const { namespace } = this.state.source;
    let payload = { verb, url: `${host}${path}`, namespace };

    KubeHandler.raisingPost(
      "/api/run/curl",
      payload,
      this.onSubmitted,
      this.onSubmitFailed
    );
  }

  saveToHistory(status){
    let args = `dep_name=${this.props.deployment.name}`;
    args = `${args}&dep_namespace=${this.props.deployment.namespace}`;
    args = `${args}&kind=http_requests`;

    const {verb, path, host } = this.state.destination;
    const backendPayload = {
      verb, path, host,
      senderNs: this.state.source.namespace,
      senderType: this.state.source.type,
      status: status
    };

    Backend.raisingPost(
      `/dep_attachments?${args}`,
      { extras: backendPayload },
      this.historyCallback
    )
  }

  onHistoryItemSelected(data){
    const { path, verb, host } = data;
    const destination = { path, verb, host };
    const source = { type: data.senderType, namespace: data.senderNs };
    this.setState(s => ({
      ...s,
      destination,
      source: { ...s.source, ...source }
    }))
  }

  enterEditState(){
    this.setState((s) => ({...s, phase: 'editing'}))
  }

  renderRunButton(){
    const phase = this.state.phase;

    const title = phase === 'response' ? 'Back to Edit' : 'Submit Request';
    const callback = phase === 'response' ? this.enterEditState : this.submit;

    return(
      <ModalButton
        isEnabled={phase !== 'submitting' && this.assessReadiness()}
        callback={callback}
        title={title}
      />
    )
  }

  static propTypes = {
    ...FULL_DEPLOYMENT,
    targetAddr: PropTypes.string,
    port: PropTypes.number
  }
}