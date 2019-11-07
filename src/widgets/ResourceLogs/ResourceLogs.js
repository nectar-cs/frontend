//@flow
import React, {useRef} from 'react'
import moment from "moment";
import Backend from "../../utils/Backend";
import {LogsView} from "./Styles";
import Text from "../../assets/text-combos";

const POLL_RATE = 1500;

export default class ResourceLogs extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      startAt: null,
      logs: ['some', 'city']
    };
    this.lineEndRef = React.createRef();
    this.fetchLogsRepeatWrapper = this.fetchLogsRepeatWrapper.bind(this);
  }

  componentDidMount(): void {
    this.fetchLogsRepeatWrapper();
  }

  componentWillUnmount(): * {
    this._willUnmount = true;
  }

  componentWillReceiveProps(){
    this.resetTime();
  }

  renderLogLines(){
    return this.state.logs.map((log, i) => (
      <Text.Code key={i}>{log}</Text.Code>
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
    if(!this._willUnmount) return;
    await this.fetchLogs();
    setTimeout(this.fetchLogsRepeatWrapper, POLL_RATE);
  }

  async fetchLogs(){
    const { namespace, resourceType, resourceName } = this.props;
    const ep = `/api/${namespace}/${resourceType}/${resourceName}/logs`;
    const logs = (await Backend.bFetch(ep))['logs'];
    this.setState(s => ({...s, logs}));
    this.lineEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  resetTime(){
    this.setState(s => ({...s,
      startAt: moment().add({seconds: -10}),
      logs: []
    }))
  }
}

type Props = {
  resourceType: 'pod' | 'deployment' | 'service',
  resourceName: string
};