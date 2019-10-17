import React, {Fragment} from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import defaults from "./defaults";
import PropTypes from "prop-types";
import S from './DebugModalStyles'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import ComingSoonSection from "../../widgets/ComingSoonSection/ComingSoonSection";
import ModalButton from "../../widgets/Buttons/ModalButton";
import {Types} from "../../types/Deployment";
import {ROUTES} from "../../containers/RoutesConsts";
import {Redirect} from "react-router";

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

export default class ChooseDebugTypeModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      selectedActivity: '',
      isRedirecting: false,
    };
  }

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderRedirect() }
        { this.renderHeader() }
        { this.renderDiagnosis() }
        { this.renderActivities() }
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
    return <Redirect to={goToFunc(base, name, namespace)}/>
  }

  renderDiagnosis(){
    return(
      <Fragment>
        <TextOverLineSubtitle text={defaults.healthChecks.title}/>
        <ComingSoonSection text={defaults.healthChecks.comingSoon}/>
      </Fragment>
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
    const activity  = this.state.selectedActivity;
    const goToFunc = activity && defaults.activities[activity].path;
    const callback = () => this.setState(s => ({...s, isRedirecting: true}));

    return(
      <ModalButton
        isEnabled={!!(activity && goToFunc)}
        callback={callback}
        title={defaults.submit}
      />
    )
  }

  renderHeader(){
    const { mode, deployment } = this.props;
    return(
      <LeftHeader
        graphicName={MiscUtils.modalImage(this, "bug_report")}
        title={defaults.header.title(deployment.name, mode)}
        subtitle={defaults.header.subtitle}
        graphicType={MiscUtils.modalGraphicType(this)}
      />
    )
  }

  static propTypes = {
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}