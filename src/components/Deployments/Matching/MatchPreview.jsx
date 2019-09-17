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
import TopLoader from "../../../widgets/TopLoader/TopLoader";

export default class MatchPreview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bundle: {
        framework: '',
        gitRemoteName: '',
        gitRepoName: '',
        imgRegistryName: '',
        imgRepoName: ''
      },
      isGitFetching: false,
      isDockerFetching: false
    };

    this.onFormDataChanged = this.onFormDataChanged.bind(this);
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
        { this.renderHeader() }
        { this.renderTopRightLoader() }
        { this.renderTitle() }
        { this.renderForm() }
        { this.renderNextButton() }
      </Fragment>
    )
  }

  renderTitle(){
    return(
      <Fragment>
        <TextOverLineTitle text={defaults.previewTitle}/>
        <p>{defaults.previewIntro}</p>
      </Fragment>
    )
  }

  renderHeader(){
    return(
      <LeftHeader
        graphicName={this.frameworkImage()}
        title={this.props.deployment.name}
        subtitle='A connected app'
      />
    )
  }

  renderForm(){
    const gFetch = (b) => this.setState(s => ({...s, isGitFetching: b}));
    const dFetch = (b) => this.setState(s => ({...s, isDockerFetching: b}));

    return(
      <MatchForm
        deployment={this.props.deployment}
        notifyChanged={this.onFormDataChanged}
        setIsGitFetching={gFetch}
        setIsDockerFetching={dFetch}
        hasGitRemote={this.props.hasGitRemote}
        hasImageRegistry={this.props.hasImageRegistry}
        {...this.state.bundle}
      />
    )
  }

  renderTopRightLoader(){
    if(this.state.isGitFetching || this.state.isDockerFetching)
      return <TopLoader isFetching={true}/>;
    else return null;
  }

  renderNextButton(){
    if(this.state.isGitFetching ||  this.state.isGitFetching)
      return null;

    return(
      <button className={s.confirm}  onClick={() => this.onAccepted()}>
        Confirm & Review Next
      </button>
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
    const framework = this.state.bundle.framework;
    return MiscUtils.frameworkImage( framework || 'docker');
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

  onFormDataChanged(hash){
    const bundle = {...this.state.bundle, ...hash};
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