//@flow
import React, {Fragment} from 'react'
import { Timeline, TimelineItem }  from 'vertical-timeline-component-for-react';
import type {ResEvent} from "../../types/Types";

export default class EventsTimeline extends React.Component{
  render(){
    return(
      <Timeline lineColor={'#ddd'}>
        <TimelineItem
          key="001"
          dateText="11/2010 – Present"
          style={{ color: '#e86971' }}>
          <h3>Title, Company</h3>
          <h4>Subtitle</h4>
          <p>This is custom?</p>
        </TimelineItem>
      </Timeline>
    )
  }
}

type Props = {
  event: Array<ResEvent>,
}