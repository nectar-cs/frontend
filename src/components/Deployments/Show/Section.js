import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Types} from "../../../types/Deployment";
import S from './SectionStyles'
import defaults from "./defaults";

export default class Section extends React.Component {

  constructor(props){
    super(props);
    this.onClicked = this.onClicked.bind(this);
  }

  render(){
    if(this.props.isChosen && this.props.deployment)
      return this.renderCollapsed();
    else return this.renderCollapsed();
  }

  renderExpanded(){
    return(
      <Fragment>
        { this.renderCollapsed() }
      </Fragment>
    )
  }

  renderCollapsed(){
    return(
      <S.Collapsed onClick={this.onClicked} chosen={this.props.isChosen} >
        <S.LeftBox>
          { this.renderIcon() }
          { this.renderTitle() }
        </S.LeftBox>
        { this.renderToggleArrow() }
      </S.Collapsed>
    )
  }

  onClicked(){
    this.props.onClicked(this.constructor.name);
  }

  renderToggleArrow(){
    const {isChosen} = this.props;
    return(<S.ToggleArrow className='material-icons'>
      { `keyboard_arrow_${isChosen ? 'up' : 'down'}` }
    </S.ToggleArrow>);
  }

  renderTitle(){
    return <S.CollapsedTitle>{this.title()}</S.CollapsedTitle>;
  }

  renderIcon(){
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
    isChosen: PropTypes.bool.isRequired,
    defaultDetailSetter: PropTypes.func.isRequired,
    deployment: Types.Deployment,
    matching: Types.Matching,
    onClicked: PropTypes.func.isRequired
  }
}