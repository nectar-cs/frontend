import React from 'react'
import PropTypes from 'prop-types'
import {Types} from "../../../types/Deployment";
import S from './SectionStyles'
import defaults from "./defaults";
import Helper from "./Helper";


export default class Section extends React.Component {

  constructor(props){
    super(props);
    this.onClicked = this.onClicked.bind(this);
    this.renderActivityModal = this.renderActivityModal.bind(this);
    this.props.defaultDetailSetter(
      this._className(),
      this.renderActivityModal
    );
  }

  render(){
    const {isChosen} = this.props;
    return(
      <S.Collapsed onClick={this.onClicked} chosen={isChosen}>
        { this.renderTitleBox() }
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
    return null;
  }

  onClicked(){
    this.props.onClicked(this._className());
  }

  renderTitle(){
    return <S.CollapsedTitle>{this.title()}</S.CollapsedTitle>;
  }

  renderIcon(){
    return(
      <S.CollapsedIcon className='material-icons'>
        { this.iconName() }
      </S.CollapsedIcon>
    );
  }

  renderActivityModal(source){
    return this._renderActivityModal(source);
  }

  _renderActivityModal(source){
    return <p>Unimplemented ({this._className()})</p>;
  }

  _className(){
    return this.constructor.name.replace("Class", "");
  }

  key(){
    return Helper.classNameToKey(this._className());
  }

  config() { return defaults.sections[this.key()] }
  iconName(){ return this.config().iconName }
  title(){ return this.config().title  }

  static propTypes = {
    isChosen: PropTypes.bool.isRequired,
    defaultDetailSetter: PropTypes.func.isRequired,
    deployment: Types.Deployment,
    matching: Types.Matching,
    onClicked: PropTypes.func.isRequired,
    refreshCallback: PropTypes.func.isRequired
  }
}