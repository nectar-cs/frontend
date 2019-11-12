import React, {Fragment} from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import Utils from "../../utils/Utils";
import defaults from "./defaults";
import PropTypes from "prop-types";
import S from './DebugModalStyles'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import ComingSoonSection from "../../widgets/ComingSoonSection/ComingSoonSection";
import ModalButton from "../../widgets/Buttons/ModalButton";
import {Types} from "../../types/CommonTypes";
import {ROUTES} from "../../containers/RoutesConsts";
import {Redirect} from "react-router";

export default class ChooseDebugTypeModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      selectedActivity: 'networkingDebug',
      isRedirecting: false,
    };
  }

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderRedirect() }
        { this.renderHeader() }
        { this.renderActivities() }
        { this.renderComingSoon() }
        { this.renderButton() }
      </FlexibleModal>
    )
  }

  renderRedirect(){
    if(!this.state.isRedirecting) return null;
    const { name, namespace } = this.props.deployment;
    const activity  = this.state.selectedActivity;
    const base = ROUTES.deployments.debug.path;
    const goToFunc = activity && defaults.activities[activity].path;
    const { deployment, matching } = this.props;
    return(
      <Redirect
        to={goToFunc(base, namespace, name)}
        state={{deployment, matching}}
      />
    )
  }

  renderComingSoon(){
    const {selectedActivity} = this.state;
    if(!selectedActivity) return null;
    if(this.isActivityImplemented()) return null;
    const bundle = defaults.activities[selectedActivity];

    return(
      <ComingSoonSection
        text={bundle.demo}
      />
    )
  }

  renderActivities(){
    const keys = Object.keys(defaults.activities);
    const activities =  keys.map(key => {
      const bundle = defaults.activities[key];
      return(
        <ActivityOffering
          key={key}
          isChosen={this.state.selectedActivity === key}
          callback={() => this.selectActivity(key)}
          {...bundle}
        />
      )
    });

    return(
      <Fragment>
        <TextOverLineSubtitle text='What ails thee?'/>
        <S.ActivitiesContainer>
          { activities }
        </S.ActivitiesContainer>
      </Fragment>
    )
  }

  selectActivity(selectedActivity){
    this.setState(s => ({...s, selectedActivity}));
  }

  renderButton(){
    const callback = () => this.setState(s => ({...s, isRedirecting: true}));

    return(
      <ModalButton
        isEnabled={this.isActivityImplemented()}
        callback={callback}
        title={defaults.submit}
      />
    )
  }

  isActivityImplemented(){
    const activity  = this.state.selectedActivity;
    const goToFunc = activity && defaults.activities[activity].path;
    return !!(activity && goToFunc);
  }

  renderHeader(){
    const { mode, deployment } = this.props;
    return(
      <LeftHeader
        graphicName={Utils.modalImage(this, "bug_report")}
        title={defaults.header.title(deployment.name, mode)}
        subtitle={defaults.header.subtitle}
        graphicType={Utils.modalGraphicType(this)}
      />
    )
  }

  static propTypes = {
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}


function ActivityOffering(props){
  return(
    <S.ActivityContainer
      onClick={props.callback}
      isChosen={props.isChosen}>
      <S.ActivityIcon className='material-icons'>
        { props.iconName }
      </S.ActivityIcon>
      <S.ActivityTitle>{props.title}</S.ActivityTitle>
    </S.ActivityContainer>
  )
}

ActivityOffering.propTypes = {
  iconName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  isChosen: PropTypes.bool.isRequired
};
