//@flow
import React from 'react'
import { Timeline, TimelineItem }  from 'vertical-timeline-component-for-react';
import type {ResEvent} from "../../types/Types";
import S from './EventStyles'
import Layout from "../../assets/layouts";
import Text from "../../assets/text-combos";
import {colored, theme} from "../../assets/constants";
import moment from "moment";

const lineColor = theme.colors.primaryColor;

export default function EventsTimeline(props: TimelineProps){

  const Items = () => props.events.map((event, i) => (
    <TimelineEvent key={i} {...event} nth={i}/>
  ));

  return(
    <S.EventsTimeline>
      <Timeline lineColor={lineColor} animate={false}>
        <Items/>
      </Timeline>
    </S.EventsTimeline>
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
    const { occurredAt } = this.props;
    const parsed = moment(occurredAt).calendar();
    return <DateComp str={parsed}/>;
  }
}

const DateComp = ({str}) => <S.DateContainer>{str}</S.DateContainer>;

type TimelineProps = {
  events: Array<ResEvent>,
}