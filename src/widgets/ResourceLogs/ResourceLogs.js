//@flow
import React, {Fragment} from 'react'
import {LogsView} from "./Styles";
import Kapi from "../../utils/Kapi";
import { Text, Loader, CenterAnnouncement } from "nectar-cs-js-common";

const POLL_RATE = 2500;

export default class ResourceLogs extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = { logs: [], isFetching: false };
    this.lineEndRef = React.createRef();
    this.isLoopRunning = true;
    this.fetchLogsRepeatWrapper = this.fetchLogsRepeatWrapper.bind(this);
  }

  async componentDidMount(): void {
    this.fetchLogsRepeatWrapper();
  }

  componentWillReceiveProps(){
    if(!this.isLoopRunning)
      this.fetchLogsRepeatWrapper();
  }

  renderLogLines(){
    return this.state.logs.map((log, i) => (
      <Text.Code key={`${log}-${i}`} chill>{log}</Text.Code>
    ))
  }

  render(){
    const { isFetching } = this.state;
    return(
      <Fragment>
        <Loader.TopRightSpinner there={isFetching}/>
        { this.renderNoPod() }
        { this.renderMainContent() }
      </Fragment>
    )
  }

  renderNoPod(){
    if(this.amReady()) return null;
    return(
      <CenterAnnouncement
        iconName='search'
        text='No pods to read logs from.'
      />
    )
  }

  renderMainContent(){
    if(!this.amReady()) return null;

    return(
      <LogsView>
        { this.renderLogLines() }
        <div ref={this.lineEndRef} />
      </LogsView>
    )
  }

  async fetchLogsRepeatWrapper(){
    if(!this._willUnmount && this.amReady()){
      await this.fetchLogs();
      setTimeout(this.fetchLogsRepeatWrapper, POLL_RATE);
    } else {
      this.isLoopRunning = false;
    }
  }

  async fetchLogs(){
    this.setState(s => ({...s, isFetching: true}));
    const logs = await Kapi.bFetch(this.genUrl());
    if((logs || []).length > 0) this.setState(s => ({...s, logs}));
    this.setState(s => ({...s, isFetching: false}));
    this.lineEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  genUrl(){
    const { namespace, podName, sinceMinutes, sinceSeconds } = this.props;
    const secondsOffset = sinceMinutes * 60 + sinceSeconds;
    return `/api/pods/${namespace}/${podName}/logs?since_seconds=${secondsOffset}`;
  }

  amReady(){
    return !!this.props.podName;
  }

  componentWillUnmount(): * { this._willUnmount = true; }
}

type Props = {
  namespace: string,
  podName: string,
  sinceMinutes: string,
  sinceSeconds: string
};
