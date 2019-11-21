//@flow
import React, {Fragment} from 'react'
import VertSection from "../../widgets/VertSection/VertSection";
import NotDoneSection from "../NotDoneSection/NotDoneSection";
import EventsTimeline from "./EventsTimeline";
import type {LightPod, ResEvent} from "../../types/Types";
import Kapi from "../../utils/Kapi";
import Loader from "../../assets/loading-spinner";

export default class PodOverview extends React.Component<Props, State>{

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      events: null
    }
  }

  componentDidMount(): * {
    this.reloadEvents()
  }

  render(){
    return(
      <Fragment>
        { this.renderLoader() }
        { this.renderTimeline() }
        { this.renderStatus() }
      </Fragment>
    )
  }

  renderLoader(){
    if(!this.state.isFetching) return null;
    return <Loader.TopRightSpinner/>;
  }

  renderTimeline(){
    const { events } = this.state;
    const { pod, mode } = this.props;
    if(events == null) return null;

    return(
      <EventsTimeline
        pod={pod}
        events={events}
        mode={mode}
      />
    )
  }

  renderStatus(){
    return(
      null
    )
  }

  async reloadEvents(){
    this.setState(s => ({...s, isFetching: true}));
    const events = (await this.fetchEvents()).reverse();
    this.setState(s => ({...s, events, isFetching: false}));
  }

  async fetchEvents(): Array<ResEvent>{
    const { namespace, name } = this.props.pod;
    const ep = `/api/pods/${namespace}/${name}/events`;
    return await Kapi.bFetch(ep);
  }
}

type Props = {
  pod: LightPod,
  mode: string
}

type State = {
  event: Array<ResEvent>
}