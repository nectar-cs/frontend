import React, {Fragment} from "react";
import {InputLine, LineInput} from "../../assets/input-combos";
import {S} from "./DockerSectionStyles";
import defaults from "./defaults";
import {ThemeProvider} from "styled-components";
import {theme} from "../../assets/constants";

export default class DockerHubForm extends React.Component{

  constructor(props){
    super(props);
    this.state = { username: '', password: '' }
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Fragment>
          { this.renderFormInputs() }
          { this.renderApology() }
        </Fragment>
      </ThemeProvider>
    )
  }

  renderFormInputs(){
    const make = (e, name) => {
      const value = e.target.value;
      this.setState(s => ({...s, [name]: value}));
    };

    return(
      <InputLine>
        <LineInput
          value={this.state.username}
          onChange={(e) => make(e, 'username')}
          placeholder='DockerHub Username'
        />
        <LineInput
          value={this.state.password}
          onChange={(e) => make(e, 'password')}
          placeholder='DockerHub Password'
          type={'password'}
        />
      </InputLine>
    )
  }

  renderApology(){
    return <S.Apology><i>{defaults.dockerApology}</i></S.Apology>;
  }

}