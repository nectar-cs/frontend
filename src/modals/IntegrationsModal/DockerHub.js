import React, {Fragment} from "react";
import {InputLine, LineInput} from "../../assets/input-combos";
import {S} from "./DockerSectionStyles";
import defaults from "./defaults";

export default class DockerHub {

  render(){
    return(
      <Fragment>
        { this.renderFormInputs() }
        { this.renderApology() }
      </Fragment>
    )
  }

  renderFormInputs(){
    return(
      <InputLine>
        <LineInput value='Username'/>
        <LineInput value='Password'/>
      </InputLine>
    )
  }

  renderApology(){
    return <S.Apology><i>{defaults.dockerApology}</i></S.Apology>;
  }

}