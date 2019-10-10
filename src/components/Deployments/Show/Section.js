import React from 'react'
import PropTypes from 'prop-types'
import {Types} from "../../../types/Deployment";
import S from './SectionStyles'

export default class Section extends React.Component {

  render(){
    if(this.props.isFocused && this.props.deployment)
      return this.renderExpanded();
    else return this.renderCollapsed();
  }

  renderExpanded(){
    return <p>exp</p>;
  }

  renderCollapsed(){
    return(
      <S.Collapsed>
        <p>adsad</p>
      </S.Collapsed>
    )
  }

  renderCollapsedIcon(){
  }

  static propTypes = {
    isFocused: PropTypes.bool.isRequired,
    defaultDetailSetter: PropTypes.func.isRequired,
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}