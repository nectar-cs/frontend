import React from 'react'
import PropTypes from 'prop-types'
import * as Styles from "./ConclusionStyles";
import {BoldStatus, CleanStatus} from "../../assets/text-combos";
import {ThemeProvider} from "styled-components";
import {theme} from "../../assets/constants";

export default class Conclusion extends React.Component {

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Styles.Container>
          { this.renderSuccess() }
          { this.renderFailure() }
        </Styles.Container>
      </ThemeProvider>
    )
  }

  renderSuccess(){
    if(this.props.isSuccess){
      return(
        <Styles.LineOne>
          <BoldStatus color={theme.colors.success}>Success.</BoldStatus>
          <Styles.Reason>{this.props.reason}</Styles.Reason>
        </Styles.LineOne>
      )
    }
  }

  renderFailure(){
    if(!this.props.isSuccess){

    } else return null;
  }

  static propTypes = {
    isSuccess: PropTypes.bool,
    reason: PropTypes.string.isRequired
  }
}
