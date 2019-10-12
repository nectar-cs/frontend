import React from 'react'
import PropTypes from 'prop-types'
import {Types} from "../../../types/Deployment";
import S from './SectionStyles'
import defaults from "./defaults";
import Helper from "./Helper";

class ActivityOffering extends React.Component{

}

export default class Section extends React.Component {

  constructor(props){
    super(props);
    this.onClicked = this.onClicked.bind(this);
    this.renderActivityModal = this.renderActivityModal.bind(this);
    this.props.defaultDetailSetter(
      this.constructor.name,
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

  renderActivityIcons(){
    const bundles = this.config().activities;
    const activityKeys = Object.keys(bundles || {});
    const { chosenActivity } = this.props;
    if(activityKeys.length <= 1) return null;

    const ActivityOfferings = () => activityKeys.map(key =>
      <ActivityOffering
        isChosen={key === chosenActivity}
        {...bundles[key]}
      />
    );
    return <S.ActivitiesContainer>
      <ActivityOfferings/>
    </S.ActivitiesContainer>
  }

  onClicked(){
    this.props.onClicked(this.constructor.name);
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

  renderActivityModal(key, source){
    return this._renderActivityModal(key, source);
  }

  _renderActivityModal(key, source){
    return this.renderDefaultModal(source);
  }

  renderDefaultModal(source){
    return <p>Unimplemented ({this.constructor.name})</p>;
  }

  key(){
    return Helper.classNameToKey(this.constructor.name);
  }

  config() { return defaults.sections[this.key()] }
  iconName(){ return this.config().iconName }
  title(){ return this.config().title  }

  static propTypes = {
    isChosen: PropTypes.bool.isRequired,
    chosenActivity: PropTypes.string,
    defaultDetailSetter: PropTypes.func.isRequired,
    deployment: Types.Deployment,
    matching: Types.Matching,
    onClicked: PropTypes.func.isRequired
  }
}