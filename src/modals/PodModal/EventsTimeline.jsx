//@flow
import React, {Fragment} from 'react'
import { Timeline, TimelineItem }  from 'vertical-timeline-component-for-react';
import type {LightPod, ResEvent} from "../../types/Types";
import S from './EventStyles'
import Layout from "../../assets/layouts";
import Text from "../../assets/text-combos";
import {colored, theme} from "../../assets/constants";
import moment from "moment";
import defaults from "./defaults";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";

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

class TimelineEvent extends React.Component<ResEvent> {

  render(){
    return(
      <TimelineItem
        key="001"
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
      case 'warning': return 'warn';
      default: return "fail"
    }
  }

  renderTitle(){
    const { type, reason } = this.props;
    return(
      <S.EventTitle emotion={this.emotion()}>
        <b>{type}: {reason}</b>
      </S.EventTitle>
    )
  }

  renderRawMessage(){
    const { message } = this.props;
    return(
      <Text.P low={1.7}>
        <b>Raw Message: </b>{message}
      </Text.P>
    )
  }

  renderMeaning(){
    const { meaning } = this.props;
    if(!meaning) return null;
    return(
      <Text.P low={1.7}>
        <b>MOSAIC Says: </b>{meaning}
      </Text.P>
    )
  }

  renderGamePlan(){
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
    return <DateComp str={parsed} far={far}/>;
  }
}

const DateComp = ({far, str}) => <S.DateContainer far={far}>{str}</S.DateContainer>;

type TimelineProps = {
  pod: LightPod,
  events: Array<ResEvent>,
  mode: string
}