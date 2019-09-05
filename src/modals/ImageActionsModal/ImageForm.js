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
          { this.renderScaleSelector() }
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
          { ImageForm.operationTypeOptions() }
        </LineInput>
      </InputLine>
    )
  }

  renderImageNameLine(){
    if(this.props.operationType !== 'change') return null;

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

  renderScaleSelector(){
    if(this.props.operationType !== 'scale') return null;

    const remover = (it) => it.value === this.props.initialReplicas ? null : it;
    const text = (i) => `${i} Pods ${i === 0 ? '(Shut down)' : ''}`;
    let options = Array.from({length: 20}, (v, i) => (
      remover({ show: text(i), value: i })
    ));
    options = options.filter(op => op);

    return(
      <InputLine>
        <LineLabel>Scale to</LineLabel>
        <LineInput
          as='select'
          value={this.props.scaleTo}
          onChange={(e) => this.onAssignment('scaleTo', e)}>
          { MiscUtils.arrayOfHashesOptions(options) }
        </LineInput>
      </InputLine>
    )
  }

  onAssignment(name, event){
    this.props.onAssignment({ [name]: event.target.value.toString() });
  }

  static operationTypeOptions(){
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
    imageName: PropTypes.string.isRequired,
    onAssignment: PropTypes.func.isRequired,
    scaleTo: PropTypes.string.isRequired,
    initialReplicas: PropTypes.number.isRequired
  }
}
