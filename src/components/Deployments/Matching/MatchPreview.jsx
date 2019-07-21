import React from 'react';
import { LeftHeader } from '../../../widgets/LeftHeader/LeftHeader';
import PropTypes from 'prop-types'
import MiscUtils from '../../../utils/MiscUtils';
import TextOverLineTitle from '../../../widgets/TextOverLineTitle/TextOverLineTitle';
import MatchForm from './MatchForm';
import s from './MatchPreview.sass'
import CenterAnnouncement from '../../../widgets/CenterAnnouncement/CenterAnnouncement';
import CenterLoader from '../../../widgets/CenterLoader/CenterLoader';
import { ROUTES } from '../../../containers/RoutesConsts';

export default class MatchPreview extends React.Component {

  static propTypes = {
    deployment: PropTypes.object,
    isSubmitted: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    isReviewComplete: PropTypes.bool
  };

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
      return MatchPreview.renderSubmitted();
    else if(this.props.isSubmitting)
      return MatchPreview.renderLoading();
    else if(this.props.isReviewComplete)
      return this.renderReviewComplete();
    else if(this.props.deployment)
      return this.renderMainContent();
    else
      return MatchPreview.renderLoading();
  }

  renderMainContent(){
    return(
      <React.Fragment>
        <LeftHeader
          graphicName={this.frameworkImage()}
          title={this.state.name}
          subtitle={this.state.description}
        />
        <TextOverLineTitle text="Microservice Source Repo"/>
        <MatchForm
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

  frameworkImage(){
    if(this.state.framework)
      return MiscUtils.frameworkImage(this.state.framework)
    else return null;
  }

  static renderSubmitted(){
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

  onInfoChanged(hash){
    this.setState((s) => ({...s, ...hash}))
  }
}