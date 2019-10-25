import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Types} from "../../types/Deployment";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import defaults from "./defaults";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import Text from "../../assets/text-combos";
import FlexibleModal from "../../hocs/FlexibleModal";
import moment from "moment";
import ModalButton from "../../widgets/Buttons/ModalButton";
import Kapi from "../../utils/Kapi";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";

export default class StuntPodRecycleModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      isDone: false
    };

    this.submit = this.submit.bind(this);
  }

  render(){
    return(
      <FlexibleModal mode='modal'>
        { this.renderHeader() }
        { this.renderLoading() }
        { this.renderDone() }
        { this.renderExplanation() }
        { this.renderTable() }
        { this.renderButton() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    return(
      <LeftHeader
        graphicName='repeat'
        graphicType='icon'
        title={defaults.header.title}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderLoading(){
    if(this.state.isSubmitting){
      return <CenterLoader/>
    } else return null;
  }

  renderDone(){
    if(!this.state.isDone) return null;
    return <CenterAnnouncement iconName='check'/>;
  }

  renderExplanation(){
    const { isSubmitting, isDone } = this.state;
    if(isSubmitting || isDone) return null;

    const Lines = () => defaults.explanation.lines.map(line => (
      <Text.P low={1.5}>{line}</Text.P>
    ));

    return(
      <Fragment>
        <TextOverLineSubtitle text={defaults.explanation.title}/>
        <Lines/>
      </Fragment>
    )
  }

  renderTable(){
    const { isSubmitting, isDone } = this.state;
    if(isSubmitting || isDone) return null;

    const {stuntPods} = this.props;
    const PodRows = () => stuntPods.map(pod => (
      <PodRow key={pod.ip} {...pod}/>
    ));

    return(
      <Fragment>
        <TextOverLineSubtitle text={defaults.list.title} />
        <table>
          <tbody>
          <PodRows/>
          </tbody>
        </table>
      </Fragment>
    )
  }

  renderButton(){
    const { isSubmitting, isDone } = this.state;
    const { closeModal } = this.props;
    const callback = isDone ? closeModal : this.submit;
    const copy = defaults.list;

    return(
      <ModalButton
        title={isDone ? copy.done : copy.button}
        callback={callback}
        isEnabled={!isSubmitting}
      />
    )
  }

  submit(){
    this.setState(s => ({...s, isSubmitting: true}));
    Kapi.post(`/api/cluster/kill_stunt_pods`, {}, () => {
      this.setState(s => ({...s, isSubmitting: false, isDone: true}));
    });
  }

  static propTypes = {
    pods: PropTypes.arrayOf(Types.LightPod)
  };
}

function PodRow({namespace, name, updatedAt, state}){
  const ts = moment(updatedAt).calendar();

  return(
    <tr>
      <td><p>{namespace}</p></td>
      <td><p>{name}</p></td>
      <td><Text.BoldStatus emotion={state}>{state}</Text.BoldStatus></td>
      <td><p>{ts}</p></td>
    </tr>
  )
}