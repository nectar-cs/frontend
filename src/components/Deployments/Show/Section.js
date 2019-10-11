import React from 'react'
import PropTypes from 'prop-types'
import {Types} from "../../../types/Deployment";
import S from './SectionStyles'
import defaults from "./defaults";

export default class Section extends React.Component {

  constructor(props){
    super(props);
    this.onClicked = this.onClicked.bind(this);
    this.props.defaultDetailSetter(
      this.constructor.name,
      () => this.defaultDetail()
    );
  }

  render(){
    const {isChosen} = this.props;
    return(
      <S.Collapsed onClick={this.onClicked} chosen={isChosen}>
        { this.renderTitleBox() }
        { this.renderToggleArrow() }
        { this.renderContent() }
      </S.Collapsed>
    );
  }

  renderTitleBox(){
    return(
      <S.LeftBox>
        { this.renderIcon() }
        { this.renderTitle() }
      </S.LeftBox>
    )
  }

  renderContent(){
    const {isChosen, deployment} = this.props;
    if(!(isChosen && deployment)) return null;
    return this.renderDetail();
  }

  renderDetail(){
    return <p>Unimplemented</p>;
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

  defaultDetail(){
    return <p>Unimplemented</p>;
  }

  key(){
    const key = this.constructor.name.replace("Section", "");
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  iconName(){ return defaults.sections[this.key()].iconName }
  title(){ return defaults.sections[this.key()].title  }

  static propTypes = {
    isChosen: PropTypes.bool.isRequired,
    defaultDetailSetter: PropTypes.func.isRequired,
    deployment: Types.Deployment,
    matching: Types.Matching,
    onClicked: PropTypes.func.isRequired
  }
}