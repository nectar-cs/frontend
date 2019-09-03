import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {} from './ImageFormStyles'
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
          <InputLine>
            <LineLabel>Image Name</LineLabel>
            <LineInput as='input'/>
          </InputLine>
        </Fragment>
      </ThemeProvider>
    )
  }

  renderTypeLine(){
    return(
      <InputLine>
        <LineLabel>Operation Type</LineLabel>
        <LineInput
          as='select'
          value={this.props.operationType}
          onChange={(e) => this.onAssignment('operationType', e)}>
          { ImageForm.options() }
        </LineInput>
      </InputLine>
    )
  }

  onAssignment(name, event){
    this.props.onAssignment({ [name]: event.target.value });
  }

  static options(){
    return MiscUtils.hashOptions({
      reload: "Force pull image with same name on all pods",
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
