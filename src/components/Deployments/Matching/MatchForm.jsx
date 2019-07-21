import React from 'react'
import PropTypes from 'prop-types'
import s from './MatchForm.sass'
import Backend from '../../../utils/Backend';
import PathSuggest from './PathSuggest';
import MiscUtils from "../../../utils/MiscUtils";

const humanizer = require('humanize-string');
const StringSimilarity = require('string-similarity');

export default class MatchForm extends React.Component {

  static propTypes = {
    setIsFetching: PropTypes.func,
    onInfoChanged: PropTypes.func,
    deployment: PropTypes.shape({
      name: PropTypes.string
    })
  };

  constructor(props){
    super(props);

    this.state = {
      repoList: [],
      repoName: 'null',
      msFramework: '',
      msName: '',
      msDescription: '',
      deploymentName: null,
      msSourcePath: ''
    };

    this.repoPathTrees = {};
    this.getCurrentRepo = this.getCurrentRepo.bind(this);
  }

  componentDidMount(){
    this.props.setIsFetching(true);
    Backend.fetchJson('/github/list_repos', (payload) => {
      this.setState((s) => ({...s, repoList: payload['data']}));
      this.guessRepoFromDep(this.props.deployment.name);
    });
  }

  guessRepoFromDep(depName){
    const repoNames = this.state.repoList.map((r) => r['name']);
    const sorting = StringSimilarity.findBestMatch(depName, repoNames);
    const winnerName = repoNames[sorting.bestMatchIndex];
    this.onRepoChanged(winnerName);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.deployment){
      if(this.props.deployment.name !== nextProps.deployment.name){
        this.guessRepoFromDep(nextProps.deployment.name)
      }

      if(nextProps.deployment.name !== this.state.deploymentName){
        this.setState((s) => ({...s,
          deploymentName: nextProps.deployment.name,
          msName: nextProps.deployment.name,
        }));
      }
    }
  }

  render(){
    const intro = "Quickly set basic information about your application so you can" +
      " recognize it later. The real configuration happens in the next step.";
    return(
      <div>
        <p>{intro}</p>
        { this.renderLineOne() }
        { this.renderLineTwo() }
        { this.renderLineThree() }
        { this.renderLineFour() }
        { this.renderLineFive() }
      </div>
    )
  }

  renderLineOne(){
    return(
      <div className={s.inputLine}>
        <p className={s.lineIntro}>
          <span className={s.lineBold}>1. </span>
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

  renderLineTwo(){
    const currentRepo = this.getCurrentRepo();
    let currentTree = null;
    if(currentRepo)
      currentTree = this.repoPathTrees[currentRepo.msName];

    return(
      <div className={s.inputLine}>
        <p className={s.lineIntro}>
          <span className={s.lineBold}>2. </span>
          Internal Path (optional)
        </p>
        <PathSuggest
          pathTree={currentTree}
        />
      </div>
    )
  }

  renderLineThree(){
    return(
      <div className={s.inputLine}>
        <p className={s.lineIntro}>
          <span className={s.lineBold}>3. </span>
          Microservice Name
        </p>
        <input
          className={s.nameInput}
          placeholder={'Application Name'}
          value={this.state.msName}
          onChange={(e) => this.onValueChanged({msName: e.target.value})}
        />
      </div>
    )
  }

  renderLineFour(){
    return(
      <div className={s.inputLine}>
        <p className={s.lineIntro}>
          <span className={s.lineBold}>4. </span>
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

  renderLineFive(){
    return(
      <div className={s.inputLine}>
        <p className={s.lineIntro}>
          <span className={s.lineBold}>5. </span>
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
    if(this.repoPathTrees[repo.msName])
      this.propagateRepoChanged(repo);
    else
      this.fetchRepoTree(repo)
  }

  fetchRepoTree(repo){
    this.props.setIsFetching(true);
    // const endpoint = `/github/repos/${repo.msName}/path_tree`;
    // Backend.fetchJson(endpoint, (result) => {
    //   const tree = result['tree'];
    //   this.repoPathTrees = {...this.repoPathTrees, [repo.msName]: tree};
      this.propagateRepoChanged(repo);
    // });
  }

  getCurrentRepo(repoName = this.state.repoName){
    return this.state.repoList.find(
      (r) => r['name'] === repoName
    );
  }

  propagateRepoChanged(repo){
    const commonBundle = {
      msName: humanizer(repo.name),
      msDescription: repo['description'],
      msFramework: repo['framework'],
      repoName: repo['name'],
    };

    this.setState((s) => ({...s, ...commonBundle}));
    this.props.onInfoChanged(commonBundle);
    this.props.setIsFetching(false);
  }

  onValueChanged(assignment){
    this.setState((s) => ({...s, ...assignment}));
    this.props.onInfoChanged(assignment);
  }

  repoChoices(){
    return this.state.repoList.map((repo) =>
      <option key={repo['name']} value={repo['name']}>
        {repo['name']}
      </option>
    );
  }

  static frameworkChoices(){
    return MiscUtils.frameworkChoices().map((name) =>
      <option key={name} value={name}>
        {name}
      </option>
    );
  }
}