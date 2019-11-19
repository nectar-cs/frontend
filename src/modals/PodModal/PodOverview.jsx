//@flow
import React, {Fragment} from 'react'
import VertSection from "../../widgets/VertSection/VertSection";
import NotDoneSection from "../NotDoneSection/NotDoneSection";
import EventsTimeline from "./EventsTimeline";

export default class PodOverview extends React.Component{

  constructor(props) {
    super(props);
  }

  componentDidMount(): * {

  }

  render(){
    return(
      <Fragment>
        { this.renderStatus() }
        { this.renderTimeline() }
      </Fragment>
    )
  }

  renderTimeline(){
    return(
      <VertSection title='Events Timeline'>
        <EventsTimeline/>
      </VertSection>
    )
  }

  renderStatus(){
    return(
      <NotDoneSection title='Status'/>
    )
  }

}