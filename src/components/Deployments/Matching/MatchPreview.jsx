import React from 'react';
import LeftHeader from '../../../widgets/LeftHeader/LeftHeader';
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
    isSubmitted: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isReviewComplete: PropTypes.bool.isRequired,
    onDeploymentReviewed: PropTypes.func.isRequired,
    submitFunction: PropTypes.func.isRequired,
    hasGithub: PropTypes.bool.isRequired
  };

  constructor(props){
    super(props);
    this.state = {
      bundle: {
        msName: '',
        msFramework: '',
        msDescription: '',
        repoId: ''
      }
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
          title={this.bundle().msName}
          subtitle={this.bundle().msDescription}
        />
        <TextOverLineTitle text="Microservice Details"/>
        { this.renderContentBody() }
        <button className={s.confirm}  onClick={() => this.onAccepted()}>
          Confirm & Review Next
        </button>
      </React.Fragment>
    )
  }

  renderContentBody(){
    if(this.props.deployment.isChecked){
      return(
        <MatchForm
          deployment={this.props.deployment}
          onInfoChanged={this.onInfoChanged}
          setIsFetching={this.props.setIsFetching}
          hasGithub={this.props.hasGithub}
        />
      )
    } else {
      let message = "Deployment not checked. It will not appear";
      message += " in your workspace. Click to check it.";
      return(
        <CenterAnnouncement
          iconName='toggle_off'
          text={message}
          action={() => this.props.notifyCheckChanged(this.props.deployment.name)}
        />
      )
    }
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
    if(this.bundle().msFramework)
      return MiscUtils.frameworkImage(this.bundle().msFramework);
    else return null;
  }

  bundle(){
    return this.state.bundle;
  }

  static renderSubmitted(){
    return(
      <CenterAnnouncement
        contentType={'nav-link'}
        routeTo={ROUTES.workspaces.index.path}
        iconName='done_all'
        text="All done. Click to continue."
      />
    )
  }

  static renderLoading(){
    return <CenterLoader/>
  }

  onAccepted(){
    this.props.onDeploymentReviewed(
      this.props.deployment.name,
      this.bundle()
    );
  }

  onInfoChanged(hash){
    const bundle = { ...this.state.bundle, ...hash };
    this.setState((s) => ({...s, bundle}));
  }
}