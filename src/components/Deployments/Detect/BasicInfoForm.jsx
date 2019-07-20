// @flow
import React from 'react'
import s from './BasicInfoForm.sass'
import WebUtils from '../../../utils/WebUtils';
import MiscUtils from '../../../utils/MiscUtils';
import PathSuggest from './PathSuggest';

const fs = require('fs');
const humanizer = require('humanize-string');

type Props = { deployment: string, setIsFetching: (bool) => void }

const StringSimilarity = require('string-similarity');

export default class BasicInfoForm extends React.Component<Props> {

  constructor(props){
    super(props);

    this.state = {
      repoList: [],
      selectedRepoId: 'null',
      framework: '',
      name: '',
      description: '',
      actualName: null,
    };

    this.repoPathTrees = {};
    this.getCurrentRepo = this.getCurrentRepo.bind(this);
  }

  componentDidMount(){
    this.props.setIsFetching(true);
    WebUtils.fetchJson('/github/list_repos', (payload) => {
      this.setState((s) => ({...s, repoList: payload['data']}));
      this.guessRepo(this.props.deployment.name);
    });
  }

  guessRepo(depName){
    const repoNames = this.state.repoList.map((r) => r.name);
    const sorting = StringSimilarity.findBestMatch(depName, repoNames);
    const winnerName = repoNames[sorting.bestMatchIndex];
    const winnerId = this.state.repoList.find((r) => r.name === winnerName).id;
    this.onRepoChanged(winnerId);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.deployment){
      if(this.props.deployment.name !== nextProps.deployment.name){
        this.guessRepo(nextProps.deployment.name)
      }

      if(nextProps.deployment.name !== this.state.actualName){
        this.setState((s) => ({...s,
          actualName: nextProps.deployment.name,
          name: nextProps.deployment.suggested,
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
          value={this.state.selectedRepoId}
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
      currentTree = this.repoPathTrees[currentRepo.name];

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
          value={this.state.name}
          onChange={(e) => this.onValueChanged({name: e.target.value})}
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
          value={this.state.description || ''}
          onChange={(e) => this.onValueChanged({description: e.target.value})}
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
          value={this.state.framework}
          className={s.repoSelect}
          onChange={(e) => this.onValueChanged({framework: e.target.value})}
        >
          { BasicInfoForm.frameworkChoices() }
        </select>
      </div>
    )
  }

  onRepoChanged(repoId){
    const repo = this.getCurrentRepo(repoId);
    if(this.repoPathTrees[repo.name])
      this.propagateRepoChanged(repo);
    else
      this.fetchRepoTree(repo)
  }

  fetchRepoTree(repo){
    this.props.setIsFetching(true);
    const endpoint = `/github/repos/${repo.name}/path_tree`;
    WebUtils.fetchJson(endpoint, (result) => {
      const tree = result['tree'];
      this.repoPathTrees = {...this.repoPathTrees, [repo.name]: tree};
      this.propagateRepoChanged(repo);
    });
  }

  getCurrentRepo(repoId = this.state.selectedRepoId){
    return this.state.repoList.find(
      (r) => r.id.toString() === repoId.toString()
    );
  }

  propagateRepoChanged(repo){
    let { name, description, framework } = repo;
    name = humanizer(name);
    const selectedRepoId = repo.id;
    const repoId = repo.id.toString();
    this.setState((s) => ({...s, name, description, framework, selectedRepoId}));
    this.props.onInfoChanged({repoId, name, description, framework});
    this.props.setIsFetching(false);
  }

  onValueChanged(assignment){
    this.setState((s) => ({...s, ...assignment}));
    this.props.onInfoChanged(assignment);
  }

  repoChoices(){
    const options = this.state.repoList.map((repo) =>
      <option key={repo.id} value={repo.id}>
        { repo.name }
      </option>
    );
    return options;
  }

  static frameworkChoices(){
    const dirName = `${__dirname}/../resources/images/frameworks/`;
    return fs.readdirSync(dirName).map((name) =>
      <option key={name} value={name}>
        {name}
      </option>
    );
  }
}