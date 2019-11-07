//@flow
import React, {useRef} from 'react'
import moment from "moment";
import {LogsView} from "./Styles";
import Text from "../../assets/text-combos";
import Kapi from "../../utils/Kapi";

const POLL_RATE = 1500;

export default class ResourceLogs extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      startAt: moment().add({seconds: -10}),
      logs: []
    };
    this.lineEndRef = React.createRef();
    this.fetchLogsRepeatWrapper = this.fetchLogsRepeatWrapper.bind(this);
  }

  componentDidMount(): void {
    this.fetchLogsRepeatWrapper();
  }

  componentWillReceiveProps(){
    this.resetTime();
  }

  renderLogLines(){
    return this.state.logs.map((log, i) => (
      <Text.Code key={i} chill>{log}</Text.Code>
    ))
  }

  render(){
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
    const logs = (await Kapi.bFetch(this.genUrl()))['logs'];
    if(logs) this.setState(s => ({...s, logs}));
    this.lineEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  genUrl(){
    const { namespace, resourceType, resourceName } = this.props;
    const ep = `/api/${resourceType}/${namespace}/${resourceName}/logs`;
    return `${ep}?timestamp=${this.state.startAt.format()}`;
  }

  resetTime(){
    this.setState(s => ({...s,
      startAt: moment().add({seconds: -10}),
      logs: []
    }))
  }

  componentWillUnmount(): * { this._willUnmount = true; }
}

type Props = {
  namespace: string,
  resourceType: 'pod' | 'deployment' | 'service',
  resourceName: string
};