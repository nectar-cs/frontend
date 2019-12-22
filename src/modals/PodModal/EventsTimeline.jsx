//@flow
import React, {Fragment} from 'react'
import { Timeline, TimelineItem }  from 'vertical-timeline-component-for-react';
import type {LightPod, ResEvent} from "../../types/Types";
import S from './EventStyles'
import { Layout, Text, colored, theme, CenterAnnouncement } from "@nectar/js-common";
import moment from "moment";
import defaults from "./defaults";

const lineColor = theme.colors.contentBackgroundColor;
const CLI = Layout.BigCodeViewer;

export default function EventsTimeline(props: TimelineProps){
  const Items = () => props.events.map((event, i) => (
    <TimelineEvent key={i} {...event} nth={i} mode={props.mode}/>
  ));

  const { namespace: ns, name } = props.pod;
  const planCode = defaults.events.gamePlan({ns, name});

  const PlanLines = () => planCode.map(line => (
    <Text.Code key={line}>{line}</Text.Code>
  ));
  const GamePlan = () => {
    if(props.events.length < 1) return null;
    return <CLI><PlanLines/></CLI>;
  };

  const EmptyView = () => {
    if(props.events.length > 0) return null;
    return <CenterAnnouncement
      text='Pod has 0 events.'
      iconName='sentiment_dissatisfied'
    />
  };

  const TheTimeline = () => {
    if(props.events.length < 1) return null;
    return(
      <Timeline lineColor={lineColor} animate={false}>
        <Items/>
      </Timeline>
    )
  };

  return(
    <Fragment>
      <S.EventsTimeline>
        <EmptyView/>
        <TheTimeline/>
      </S.EventsTimeline>
      <GamePlan/>
    </Fragment>
  )
}

class TimelineEvent extends React.Component<EventProps> {

  constructor(props) {
    super(props);
    this.state = { isExpanded: props.nth === 0 };
    this.toggle = this.toggle.bind(this);
  }

  render(){
    return(
      <TimelineItem
        dateComponent={this.renderTimestamp()}
        style={{color: colored(this.emotion())}}>
        { this.renderTitle() }
        { this.renderRawMessage() }
        { this.renderGamePlan() }
        { this.renderMeaning() }
      </TimelineItem>
    )
  }

  emotion(){
    switch (this.props.type.toLowerCase()) {
      case "normal": return 'success';
      case 'warning': return 'fail';
      default: return "fail"
    }
  }

  renderTitle(){
    const { type, reason } = this.props;
    return(
      <S.EventTitle onClick={this.toggle} emotion={this.emotion()}>
        <b>{type}: {reason}</b>
      </S.EventTitle>
    )
  }

  renderRawMessage(){
    if(!this.state.isExpanded) return null;
    const { message } = this.props;
    return(
      <Text.P low={1.7}>
        <b>Raw Message: </b>{message}
      </Text.P>
    )
  }

  renderMeaning(){
    if(!this.state.isExpanded) return null;
    const { meaning } = this.props;
    if(!meaning) return null;
    return(
      <Layout.TextLine low={2}>
        <Text.BoldStatus emotion='success' raw>
          <b>MOSAIC: </b>
        </Text.BoldStatus>
        <p> {meaning}</p>
      </Layout.TextLine>
    )
  }

  renderGamePlan(){
    if(!this.state.isExpanded) return null;
    const { name, ns } = this.props;
    return(
      <Layout.BigCodeViewer>
        <Text.Code>k get event/{name} -n {ns}</Text.Code>
      </Layout.BigCodeViewer>
    )
  }

  renderTimestamp(){
    const { occurredAt, mode } = this.props;
    const parsed = moment(occurredAt).calendar();
    const far = mode === 'fragment';
    return <DateComp callback={this.toggle} str={parsed} far={far}/>;
  }

  toggle(){
    this.setState(s => ({...s, isExpanded: !s.isExpanded}));
  }
}

const DateComp = ({far, str, callback}) => (
  <S.DateContainer
    far={far}
    onClick={callback}
  >
    {str}
  </S.DateContainer>
);

type TimelineProps = {
  pod: LightPod,
  events: Array<ResEvent>,
  mode: string
}

type EventProps = {
  ...ResEvent,
  defaultExpansion: boolean,
  nth: number
}
