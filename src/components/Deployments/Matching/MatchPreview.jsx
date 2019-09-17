import React, {Fragment} from 'react';
import LeftHeader from '../../../widgets/LeftHeader/LeftHeader';
import PropTypes from 'prop-types'
import MiscUtils from '../../../utils/MiscUtils';
import TextOverLineTitle from '../../../widgets/TextOverLineTitle/TextOverLineTitle';
import MatchForm from './MatchForm';
import s from './MatchPreview.sass'
import CenterAnnouncement from '../../../widgets/CenterAnnouncement/CenterAnnouncement';
import defaults from './defaults'
import { ROUTES } from '../../../containers/RoutesConsts';

export default class MatchPreview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bundle: {
        msFramework: '',
        msDescription: '',
        remoteName: '',
        repoName: ''
      }
    };

    this.onInfoChanged = this.onInfoChanged.bind(this);
  }

  render(){
    return(
      <Fragment>
        { this.renderSubmitted() }
        { this.renderReviewComplete() }
        { this.renderMainContent() }
      </Fragment>
    );
  }

  renderMainContent(){
    if(this.props.isSubmitting) return null;
    if(!this.props.deployment) return null;

    return(
      <Fragment>
        <LeftHeader
          graphicName={this.frameworkImage()}
          title={this.props.deployment.name}
          subtitle={this.bundle().msDescription}
        />
        <TextOverLineTitle text={defaults.previewTitle}/>
        <p>{defaults.previewIntro}</p>
        <MatchForm
          deployment={this.props.deployment}
          onInfoChanged={this.onInfoChanged}
          setIsFetching={this.props.setIsFetching}
          hasGitRemote={this.props.hasGitRemote}
          hasImageRegistry={this.props.hasImageRegistry}
        />
        <button className={s.confirm}  onClick={() => this.onAccepted()}>
          Confirm & Review Next
        </button>
      </Fragment>
    )
  }

  renderReviewComplete(){
    if(!this.props.isReviewComplete) return null;

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

  renderSubmitted(){
    if(!this.props.isSubmitted) return null;
    return(
      <CenterAnnouncement
        contentType={'nav-link'}
        routeTo={ROUTES.workspaces.index.path}
        iconName='done_all'
        text="All done. Click to continue."
      />
    )
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

  static propTypes = {
    deployment: PropTypes.object,
    isSubmitted: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isReviewComplete: PropTypes.bool.isRequired,
    onDeploymentReviewed: PropTypes.func.isRequired,
    submitFunction: PropTypes.func.isRequired,
    hasGitRemote: PropTypes.bool.isRequired,
    hasImageRegistry: PropTypes.bool.isRequired
  };
}