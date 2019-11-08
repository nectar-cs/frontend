//@flow
import React, {Fragment} from 'react'
import moment from "moment";
import {LogsView} from "./Styles";
import Text from "../../assets/text-combos";
import Kapi from "../../utils/Kapi";
import Loader from "../../assets/loading-spinner";
import CenterAnnouncement from "../CenterAnnouncement/CenterAnnouncement";

const POLL_RATE = 2500;

export default class ResourceLogs extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = { logs: [], isFetching: false };
    this.lineEndRef = React.createRef();
    this.fetchLogsRepeatWrapper = this.fetchLogsRepeatWrapper.bind(this);
  }

  componentDidMount(): void {
    this.fetchLogsRepeatWrapper();
  }

  componentWillReceiveProps(){
  }

  renderLogLines(){
    return this.state.logs.map((log, i) => (
      <Text.Code key={i} chill>{log}</Text.Code>
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
    if(this.props.podName) return null;
    return(
      <CenterAnnouncement
        iconName='search'
        text='No pods to read logs from'
      />
    )
  }

  renderMainContent(){
    if(!this.props.podName) return null;

    return(
      <LogsView>
        { this.renderLogLines() }
        <div ref={this.lineEndRef} />
      </LogsView>
    )
  }

  async fetchLogsRepeatWrapper(){
    if(this._willUnmount) return;
    await this.fetchLogs();
    setTimeout(this.fetchLogsRepeatWrapper, POLL_RATE);
  }

  async fetchLogs(){
    this.setState(s => ({...s, isFetching: true}));
    const logs = await Kapi.bFetch(this.genUrl());
    if(logs) this.setState(s => ({...s, logs}));
    this.setState(s => ({...s, isFetching: false}));
    this.lineEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  genUrl(){
    const { namespace, podName, sinceMinutes, sinceSeconds } = this.props;
    const secondsOffset = sinceMinutes * 60 + sinceSeconds;
    return `/api/pods/${namespace}/${podName}/logs?since_seconds=${secondsOffset}`;
  }

  componentWillUnmount(): * { this._willUnmount = true; }
}

type Props = {
  namespace: string,
  podName: string,
  sinceMinutes: string,
  sinceSeconds: string
};