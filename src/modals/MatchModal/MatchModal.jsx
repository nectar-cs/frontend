import React, {Fragment} from 'react';
import LeftHeader from '../../widgets/LeftHeader/LeftHeader';
import PropTypes from 'prop-types'
import TextOverLineTitle from '../../widgets/TextOverLineTitle/TextOverLineTitle';
import MatchForm from './MatchForm';
import Button from "../../assets/buttons";
import MiscUtils from "../../utils/MiscUtils";
import {Types} from "../../types/Deployment";
import Loader from "../../assets/loading-spinner";
import Helper from "./Helper";
import defaults from './defaults'
import RemotesHelper from "./RemotesHelper";

export default class MatchModal extends React.Component {
  constructor(props){

    super(props);
    this.state = {
      choices: MatchModal.defaultChoices(props),
      isGitFetching: false,
      isDockerFetching: false,
      isSubmitting: false,
      isPathsFetching: false,
      matching: null
    };

    this.deploymentName = MiscUtils.tor(() => props.deployment.name);
    this.update = this.update.bind(this);
    this.acceptMatch = this.acceptMatch.bind(this);
    this.skipMatch = this.skipMatch.bind(this);
  }

  componentDidMount() {

  }

  // componentWillReceiveProps(nextProps){
  //   if(nextProps.deployment){
  //     this.deploymentName = nextProps.deployment.name;
  //     if(this.props.deployment.name !== this.deploymentName){
  //       if(this.props.hasGitRemote) this.onNewDeployment('git');
  //       if(this.props.hasImageRegistry) this.onNewDeployment('img');
  //     }
  //   }
  // }

  render(){
    return(
      <Fragment>
        { this.renderHeader() }
        { this.renderTopRightLoader() }
        { this.renderTitle() }
        { this.renderForm() }
        { this.renderButtons() }
      </Fragment>
    )
  }

  update(field, value){
    this.setState(s => ({
      ...s,
      choices: {...s.choices, [field]: value}
    }));
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
    const { mode, deployment } = this.props;
    return(
      <LeftHeader
        graphicName={Helper.frameworkImage(this)}
        graphicType={MiscUtils.modalGraphicType(this)}
        title={defaults.header.title(mode, deployment)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderForm(){
    const { choices } = this.state;
    return(
      <MatchForm
        deployment={this.props.deployment}
        gitRemoteChoices={RemotesHelper.remoteOptions()}
        imgRemoteChoices={RemotesHelper.remoteOptions()}
        gitRepoChoices={RemotesHelper.remoteOptions()}
        imgRepoChoices={RemotesHelper.remoteOptions()}
        dfPathChoices={RemotesHelper.dockerfileChoices()}
        gitRemoteName={choices.gitRemoteName}
        gitRepoName={choices.gitRepoName}
        dfPath={choices.dfPath}
        framework={choices.framework}
        notifyFormValueChange={this.update}
      />
    )
  }

  renderTopRightLoader(){
    if(!Helper.isLoading(this)) return null;
    return <Loader.TopRightSpinner/>;
  }

  renderButtons(){
    const { mode } = this.props;
    return(
      <Button.BigBottomButtons>
        <Button.BigButton onClick={this.acceptMatch}>
          Submit { mode }
        </Button.BigButton>
      </Button.BigBottomButtons>
    );
  }

  acceptMatch(){
    const { mode, onDeploymentReviewed } = this.props;
    const deployment = this.state.bundle;
    if(mode === 'tutorial')
      onDeploymentReviewed(this.deploymentName, deployment);
    else Helper.submitSingle(this, deployment);
  }

  skipMatch(){
    const { mode, onDeploymentReviewed } = this.props;
    const deployment = this.state.bundle;
    if(mode === 'tutorial')
      onDeploymentReviewed(this.deploymentName, null);
    else Helper.submitDelete(this, deployment);
  }

  static defaultChoices(props){
    let { matching } = props;
    matching = matching || {};

    return({
      gitRemoteList: [],
      imgRemoteList: [],
      dfPathList: [],

      gitRemoteName: matching.gitRemoteName || '',
      imgRemoteName: matching.imgRemoteName || '',
      gitRepoName: matching.gitRepoName || '',
      imgRepoName: matching.imgRepoName || '',

      dfPath: '',
      framework: matching.framework
    });
  }

  static propTypes = {
    deployment: PropTypes.object,
    matching: Types.Deployment,
    onDeploymentReviewed: PropTypes.func,
    hasGitRemote: PropTypes.bool.isRequired,
    hasImageRegistry: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['detail', 'tutorial']).isRequired
  };
}