import React from 'react'
import PropTypes from 'prop-types'
import s from './MatchForm.sass'
import PathSuggest from './PathSuggest';
import MiscUtils from "../../../utils/MiscUtils";
import Backend from "../../../utils/Backend";
import DataUtils from "../../../utils/DataUtils";

const StringSimilarity = require('string-similarity');

export default class MatchForm extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      gitRemoteList: [],
      imgRegistryList: [],
      repoName: 'null',
      msFramework: '',
      msDescription: '',
      deploymentName: null,
      msSourcePath: ''
    };

    this.deploymentName = null;
    this.repoPathTrees = {};
    this.getCurrentRepo = this.getCurrentRepo.bind(this);
  }

  componentDidMount(){
    this.deploymentName = this.props.deployment.name;

    if(this.props.hasGitRemote)
      this.fetchGitRepos();
    //
    // if(this.props.hasImageRegistry)
    //   this.fetchImageRegistries();
  }

  componentWillReceiveProps(nextProps){
    console.log("Comp will receive props");
    // if(nextProps.deployment){
    //   this.deploymentName = nextProps.deployment.name;
    //   if(this.props.deployment.name !== this.deploymentName){
    //     if(this.props.hasGitRemote){
    //       this.guessRepoFromDep(nextProps.deployment.name)
    //     }
    //   }
    // }
  }

  render(){
    return(
      <div>
        {/*{ this.props.hasGitRemote ? this.renderRepoInput() : null }*/}
        {/*{ this.props.hasGitRemote ? this.renderPathInput() : null }*/}
        {/*{ this.renderDescriptionInput() }*/}
        {/*{ this.renderFrameworkSelect() }*/}
      </div>
    )
  }

  renderRepoInput(){
    return(
      <div className={s.inputLine}>
        <p className={s.lineIntro}>
          Source Code Repository
        </p>
        <select
          className={s.repoSelect}
          value={this.state.repoName}
          onChange={(e) => this.onRepoChanged(e.target.value)}>
          { this.repoChoices() }
        </select>
      </div>
    )
  }

  renderPathInput(){
    const currentRepo = this.getCurrentRepo();
    let currentTree = null;
    if(currentRepo)
      currentTree = this.repoPathTrees[currentRepo.msName];

    return(
      <div className={s.inputLine}>
        <p className={s.lineIntro}>
          Internal Path (optional)
        </p>
        <PathSuggest
          pathTree={currentTree}
        />
      </div>
    )
  }

  renderDescriptionInput(){
    if(!this.props.hasGitRemote) return null;

    return(
      <div className={s.inputLine}>
        <p className={s.lineIntro}>
          Description
        </p>
        <input
          className={s.nameInput}
          placeholder={'A short description'}
          value={this.state.msDescription || ''}
          onChange={(e) => this.onValueChanged({msDescription: e.target.value})}
        />
      </div>
    )
  }

  renderFrameworkSelect(){
    return(
      <div className={s.inputLine}>
        <p className={s.lineIntro}>
          Language or Framework
        </p>
        <select
          value={this.state.msFramework}
          className={s.repoSelect}
          onChange={(e) => this.onValueChanged({msFramework: e.target.value})}
        >
          { MatchForm.frameworkChoices() }
        </select>
      </div>
    )
  }

  onRepoChanged(repoName){
    const repo = this.getCurrentRepo(repoName);
    if(repoName && repoName !== 'null'){
      this.propagateRepoChanged(repo);
    } else {
      this.propagateNoGitDefaults();
    }
  }

  getCurrentRepo(repoName = this.state.repoName){
    return this.state.repoList.find(
      (r) => r['name'] === repoName
    );
  }

  fetchGitRepos(){
    this.props.setIsFetching(true);
    Backend.raisingFetch('/git_remotes/loaded', (payload) => {
      const gitRemoteList = DataUtils.objKeysToCamel(payload)['data'];
      this.setState((s) => ({...s, remotesList: gitRemoteList}));
      this.props.setIsFetching(false);
      // this.guessRepoFromDep(this.props.deployment.name);
    });
  }

  fetchImageRegistries(){

  }

  guessRepoFromDep(depName){
    const repoNames = this.state.repoList.map((r) => r['name']);
    const sorting = StringSimilarity.findBestMatch(depName, repoNames);
    const winnerName = repoNames[sorting.bestMatchIndex];
    this.onRepoChanged(winnerName);
  }

  propagateRepoChanged(repo){
    const commonBundle = {
      msDescription: repo['description'],
      msFramework: repo['framework'],
      repoName: repo['name'],
    };

    this.setState((s) => ({...s, ...commonBundle}));
    this.props.onInfoChanged(commonBundle);
    this.props.setIsFetching(false);
  }

  propagateNoGitDefaults(){
    const bundle = {
      msDescription: "",
      msFramework: 'docker'
    };

    this.setState((s) => ({...s,
      deploymentName: this.props.deployment.name,
      ...bundle
    }));
    this.props.onInfoChanged(bundle);
  }

  onValueChanged(assignment){
    this.setState((s) => ({...s, ...assignment}));
    this.props.onInfoChanged(assignment);
  }

  static propTypes = {
    setIsFetching: PropTypes.func.isRequired,
    onInfoChanged: PropTypes.func.isRequired,
    hasGitRemote: PropTypes.bool.isRequired,
    hasImageRegistry: PropTypes.bool.isRequired,
    deployment: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  };

}