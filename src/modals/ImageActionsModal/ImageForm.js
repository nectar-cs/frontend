import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {InputLine, LineInput, LineLabel} from "../../assets/input-combos";
import {theme} from "../../assets/constants";
import {ThemeProvider} from "styled-components";
import MiscUtils from "../../utils/MiscUtils";

export default class ImageForm extends React.Component {
  render(){
    return(
      <ThemeProvider theme={theme}>
        <Fragment>
          { this.renderTypeLine() }
          { this.renderImageNameLine() }
        </Fragment>
      </ThemeProvider>
    )
  }

  renderTypeLine(){
    return(
      <InputLine>
        <LineLabel>I want to</LineLabel>
        <LineInput
          as='select'
          value={this.props.operationType}
          onChange={(e) => this.onAssignment('operationType', e)}>
          { ImageForm.options() }
        </LineInput>
      </InputLine>
    )
  }

  renderImageNameLine(){
    return(
      <InputLine>
        <LineLabel>Image Name</LineLabel>
        <LineInput
          disabled={this.props.operationType !== 'change'}
          value={this.props.imageName}
          onChange={(e) => this.onAssignment('imageName', e)}/>
      </InputLine>
    )
  }

  onAssignment(name, event){
    this.props.onAssignment({ [name]: event.target.value });
  }

  static options(){
    return MiscUtils.hashOptions({
      reload: "Force pull & apply an image with the same name",
      change: "Supply a new image name",
      scale: "Change the number of pods, i.e 'scale' ",
      choose: "Choose from popular images like nginx",
      docker: "Choose a docker image from your remote registry",
      git: "Build an image from a git remote"
    })
  }

  static propTypes = {
    operationType: PropTypes.string.isRequired,
    imageName: PropTypes.string,
    onAssignment: PropTypes.func.isRequired
  }
}
