import React from 'react'
import PropTypes from 'prop-types'
import {Types} from "../../../types/Deployment";
import S from './SectionStyles'
import defaults from "./defaults";

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
        <S.LeftBox>
          { this.renderCollapsedIcon() }
          { this.renderCollapsedTitle() }
        </S.LeftBox>
        { this.renderToggleArrow() }
      </S.Collapsed>
    )
  }

  renderToggleArrow(){
    return(<S.ToggleArrow className='material-icons'>
      keyboard_arrow_down
    </S.ToggleArrow>);
  }

  renderCollapsedTitle(){
    return <S.CollapsedTitle>{this.title()}</S.CollapsedTitle>;
  }

  renderCollapsedIcon(){
    return(<S.CollapsedIcon className='material-icons'>
      { this.iconName() }
    </S.CollapsedIcon>);
  }

  iconName(){ return defaults.sections[this.key()].iconName }
  title(){ return defaults.sections[this.key()].title  }

  key(){
    const key = this.constructor.name.replace("Section", "");
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  static propTypes = {
    isFocused: PropTypes.bool.isRequired,
    defaultDetailSetter: PropTypes.func.isRequired,
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}