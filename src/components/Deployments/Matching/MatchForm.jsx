import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import Backend from "../../../utils/Backend";
import DataUtils from "../../../utils/DataUtils";
import {FormHelper as H} from "./FormHelper";
import {InputLine, LineInput, LineLabel} from "../../../assets/input-combos";
import {ThemeProvider} from "styled-components";
import {theme} from "../../../assets/constants";

export default class MatchForm extends React.Component {

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
      H.gitRemoteOptions(this.props.gitRemoteList)
    );
  }

  renderRepoInput(){
    if(!this.props.hasGitRemote) return null;
    const { gitRemoteList, gitRemoteName } = this.props;
    return this.makeSelect(
      'Git Repository',
      'gitRepoName',
      H.gitRepoOptions(gitRemoteList, gitRemoteName)
    );
  }

  renderFrameworkSelect(){
    return this.makeSelect(
      'Framework or Language',
      'framework',
      H.frameworkOptions()
    );
  }

  makeSelect(title, field, choices){
    const callback = (e) => {
      this.props.notifyChanged(field, e.target.value);
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

  static propTypes = {
    gitRemoteList: PropTypes.array,
    imgRegistryList: PropTypes.array,
    gitRemoteName: PropTypes.string,
    gitRepoName: PropTypes.string,
    imgRegistryName: PropTypes.string,
    imgRepoName: PropTypes.string,
    notifyChanged: PropTypes.func.isRequired,
    hasGitRemote: PropTypes.bool.isRequired,
    hasImageRegistry: PropTypes.bool.isRequired,
    deployment: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  };

}
