import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import Backend from "../../../utils/Backend";
import DataUtils from "../../../utils/DataUtils";
import {FormHelper as H} from "./FormHelper";
import {InputLine, LineInput, LineLabel} from "../../../assets/input-combos";
import {ThemeProvider} from "styled-components";
import {theme} from "../../../assets/constants";

export default class MatchForm extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      gitRemoteList: [],
      imgRegistryList: [],
      deploymentName: null,
    };

    this.deploymentName = null;
  }

  componentDidMount(){
    this.deploymentName = this.props.deployment.name;

    if(this.props.hasGitRemote)
      this.fetchGitRepos();

    // if(this.props.hasImageRegistry)
    //   this.fetchImageRegistries();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.deployment){
      this.deploymentName = nextProps.deployment.name;
      if(this.props.deployment.name !== this.deploymentName){
        if(this.props.hasGitRemote){
          const repoName = H.guessRepo(
            this.repoNames(),
            this.deploymentName
          );
          this.props.notifyChanged({gitRepoName: repoName});
        }
      }
    }
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Fragment>
          { this.renderGitRemoteInput() }
          { this.renderRepoInput() }
          { this.renderFrameworkSelect() }
        </Fragment>
      </ThemeProvider>
    )
  }

  renderGitRemoteInput(){
    if(!this.props.hasGitRemote) return null;
    return this.makeSelect(
      'Git Remote',
      'gitRemoteName',
      H.remotesOptions(this)
    );
  }

  renderRepoInput(){
    if(!this.props.hasGitRemote) return null;
    return this.makeSelect(
      'Git Repository',
      'gitRepoName',
      H.gitRepoOptions(this, this.props.gitRemoteName)
    );
  }

  renderFrameworkSelect(){
    return this.makeSelect(
      'Framework or Language',
      'framework',
      H.frameworkOptions()
    );
  }

  fetchGitRepos(){
    this.props.setIsGitFetching(true);
    Backend.raisingFetch('/git_remotes/loaded', (payload) => {
      const gitRemoteList = DataUtils.objKeysToCamel(payload)['data'];
      const remote = gitRemoteList[0];
      const remoteName = remote.identifier;
      const repoNames = H.gitRepoNames(gitRemoteList, remoteName);
      const repoName = H.guessRepo(repoNames, this.props.deployment.name);
      const repo = H.selectedRepo(gitRemoteList, remoteName, repoName);

      this.setState((s) => ({...s, gitRemoteList}));
      this.props.notifyChanged({gitRemoteName: remoteName});
      this.props.notifyChanged({gitRepoName: repoName});
      this.props.notifyChanged({framework: repo.framework});
      this.props.setIsGitFetching(false);
    });
  }

  fetchImageRegistries(){}

  makeSelect(title, field, choices){
    const callback = (e) => {
      this.props.notifyChanged({[field]: e.target.value});
    };

    return(
      <InputLine>
        <LineLabel size='large'>{title}</LineLabel>
        <LineInput
          as='select'
          value={this.props[field]}
          onChange={(e) => callback(e)}>
          { choices }
        </LineInput>
      </InputLine>
    )
  }

  repoNames() { return H.gitRepoNames(this, this.props.gitRemoteName); }

  static propTypes = {
    gitRemoteName: PropTypes.string,
    gitRepoName: PropTypes.string,
    imgRegistryName: PropTypes.string,
    imgRepoName: PropTypes.string,
    setIsGitFetching: PropTypes.func.isRequired,
    setIsDockerFetching: PropTypes.func.isRequired,
    notifyChanged: PropTypes.func.isRequired,
    hasGitRemote: PropTypes.bool.isRequired,
    hasImageRegistry: PropTypes.bool.isRequired,
    deployment: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  };

}
