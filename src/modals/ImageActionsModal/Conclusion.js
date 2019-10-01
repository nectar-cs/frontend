import React from 'react'
import PropTypes from 'prop-types'
import * as Styles from "./ConclusionStyles";
import {BoldStatus} from "../../assets/text-combos";

export default class Conclusion extends React.Component {

  render(){
    return(
      <Styles.Container>
        { this.renderSuccess() }
        { this.renderFailure() }
      </Styles.Container>
    )
  }

  renderSuccess(){
    if(this.props.isSuccess){
      return(
        <Styles.LineOne>
          <BoldStatus emotion='success'>Success.</BoldStatus>
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
