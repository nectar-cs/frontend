import React from 'react';
import { LeftHeader } from '../../../widgets/LeftHeader/LeftHeader';
import MiscUtils from '../../../utils/MiscUtils';
import TextOverLineTitle from '../../../widgets/TextOverLineTitle/TextOverLineTitle';
import BasicInfoForm from './BasicInfoForm';
import s from './SysObjectPreview.sass'
import CenterAnnouncement from '../../../widgets/CenterAnnouncement/CenterAnnouncement';
import CenterLoader from '../../../widgets/CenterLoader/CenterLoader';
import { ROUTES } from '../../../containers/RoutesConsts';



export default class SysObjectPreview extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name: '',
      framework: '',
      description: '',
      repoId: ''
    };

    this.onInfoChanged = this.onInfoChanged.bind(this);
  }

  render(){
    if(this.props.isSubmitted)
      return this.renderSubmitted();
    else if(this.props.isSubmitting)
      return SysObjectPreview.renderLoading();
    else if(this.props.isReviewComplete)
      return this.renderReviewComplete();
    else if(this.props.deployment)
      return this.renderMainContent();
    else
      return SysObjectPreview.renderLoading();
  }

  renderMainContent(){
    return(
      <React.Fragment>
        { this.renderHeader() }
        <TextOverLineTitle text="Microservice Source Repo"/>
        <BasicInfoForm
          deployment={this.props.deployment}
          onInfoChanged={this.onInfoChanged}
          setIsFetching={this.props.setIsFetching}
        />
        <button className={s.confirm}  onClick={() => this.onAccepted()}>
          Confirm & Review Next
        </button>
      </React.Fragment>
    )
  }

  renderReviewComplete(){
    return(
      <CenterAnnouncement
        action={this.props.submitFunction}
        iconName='done'
        text="Review Complete. Click to commit."
      />
    )
  }

  renderSubmitted(){
    return(
      <CenterAnnouncement
        contentType={'nav-link'}
        routeTo={ROUTES.sysObjects.index}
        iconName='done_all'
        text="All done. Click to continue."
      />
    )
  }

  static renderLoading(){
    return <CenterLoader/>
  }

  onAccepted(){
    const { name, description, repoId, framework } = this.state;
    this.props.onDeploymentReviewed({
      name, description, repoId, framework, status: 'accepted'
    })
  }

  renderHeader(){
    return(
      <LeftHeader
        graphicName={MiscUtils.frameworkImage(this.state.framework)}
        title={this.state.name}
        subtitle={this.state.description}
      />
    )
  }

  onInfoChanged(hash){
    console.log("NEW SHIT");
    console.log(hash);
    this.setState((s) => ({...s, ...hash}))
  }
}