import React, {Fragment} from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import ModalButton from "../../widgets/Buttons/ModalButton";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import Text from "../../assets/text-combos";
import Layout from "../../assets/layouts";
import Kapi from "../../utils/Kapi";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";

export default class SoftwareUpdateModal extends React.Component {

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
        { this.renderExplanation() }
        { this.renderBreakdown() }
        { this.renderButton() }
        { this.renderLoader() }
        { this.renderDone() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    return(
      <LeftHeader
        graphicName='cached'
        graphicType='icon'
        title='Mosaic Self Update'
        subtitle="Let me become my ultimate self"
      />
    )
  }

  renderBreakdown(){
    const { isSubmitting, isDone } = this.state;
    if(isSubmitting || isDone) return null;

    const { bundle } = this.props;
    const Rows = () => Object.keys(bundle).map(app => (
      <AppRow key={app} name={app} hot={bundle[app]['updateNecessary']} />
    ));
    return(
      <Fragment>
        <TextOverLineSubtitle text="Deployments"/>
        <table>
          <tbody>
            <Rows/>
          </tbody>
        </table>
      </Fragment>
    )
  }

  renderExplanation(){
    const { isSubmitting, isDone } = this.state;
    if(isSubmitting || isDone) return null;

    return(
      <Fragment>
        <TextOverLineSubtitle text="What's going on?"/>
        <Text.P><b>Mosaic</b>, which is running in your cluster, needs to update
          one or more of the images inside its deployments.
        </Text.P>
        <Text.P low={2}><b>What will happen</b> is Nectar will kill its own pods so that
          they can be restarted with the new image.
        </Text.P>
        <Text.P low={2}><b>This means</b> the app will stop working for ~15 seconds.
          To monitor the update, run
        </Text.P>
        <Layout.BigCodeViewer>
          <Text.Code>kubectl get deploy -n nectar</Text.Code>
        </Layout.BigCodeViewer>
      </Fragment>
    )
  }

  renderLoader(){
    const { isSubmitting, isDone } = this.state;
    if(!isSubmitting || isDone) return null;
    return <CenterLoader/>;
  }

  renderButton(){
    const { isSubmitting, isDone } = this.state;
    if(isSubmitting || isDone) return null;

    return(
      <ModalButton
        callback={this.submit}
        title='Update'
      />
    )
  }

  renderDone(){
    if(!this.state.isDone) return null;
    return(
      <CenterAnnouncement
        iconName='av_timer'
        text='Reload the app in 20 sec. Click here to close.'
        contentType='action'
        action={this.props.closeModal}
      />
    )
  }

  async submit(){
    this.setState(s => ({...s, isSubmitting: true}));
    const ep = '/api/status/restart';
    const deployments = this.outdatedDeployments();
    await Kapi.blockingPost(ep, { deployments });
    this.setState(s => ({...s, isSubmitting: false, isDone: true}));
  }

  outdatedDeployments(){
    const { bundle } = this.props;
    return Object.keys(bundle).filter(key => (
      bundle[key]['updateNecessary']
    ));
  }
}

function AppRow({name, hot}){
  const emotion = hot ? 'failure' : 'success';
  const word = hot ? 'needs updating' : 'up to date';
  return(
    <tr>
      <td><p>{name}</p></td>
      <td><Text.BoldStatus raw emotion={emotion}>{word}</Text.BoldStatus></td>
    </tr>
  )
}