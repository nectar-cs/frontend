import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ErrComponent from "../../../hocs/ErrComponent";
import Helper from "./Helper";
import S from './DeploymentShowStyles'

class DeploymentShowClass extends React.Component{

  constructor(props){
    super(props);
    const focusedSection = Helper.defaultSection.name;
    const focusedActivity = Helper.defaultActivity(focusedSection);

    this.state = {
      deployment: null,
      matching: null,
      commit: null,
      focusedSection,
      focusedActivity
    };

    this.setDefaultDetailFn = this.setDefaultDetailFn.bind(this);
    this.onSectionToggled = this.onSectionToggled.bind(this);
    this.onActivityToggled = this.onActivityToggled.bind(this);
    this.reload = this.reload.bind(this);
    this.defDetailFns = {};
  }

  componentDidMount(){
    this.reload();
  }

  render(){
    return(
      <Fragment>
        { this.renderSections() }
        { this.renderRightSideModal() }
      </Fragment>
    )
  }

  renderSections(){
    const { deployment, matching  } = this.state;
    const { focusedSection, focusedActivity } = this.state;
    const Sections = () => Helper.sectionClasses.map(Section => (
      <Section
        key={Section.name}
        deployment={deployment}
        matching={matching}
        isChosen={Section.name === focusedSection}
        chosenActivity={focusedActivity}
        defaultDetailSetter={this.setDefaultDetailFn}
        onClicked={this.onSectionToggled}
        onActivityClicked={this.onActivityToggled}
        refreshCallback={this.reload}
      />
    ));
    return <S.LeftPanel><Sections/></S.LeftPanel>;
  }

  renderRightSideModal(){
    const { deployment, matching } = this.state;
    const { focusedSection, focusedActivity } = this.state;
    const detailFunc = this.defDetailFns[focusedSection];
    const bundle = { deployment, matching };
    if(!(deployment && detailFunc)) return null;

    return(
      <S.RightPanel>
        { detailFunc(focusedActivity, bundle) }
      </S.RightPanel>
    )
  }

  setDefaultDetailFn(name, defaultFn){
    this.defDetailFns[name] = defaultFn;
  }

  onSectionToggled(focusedSection){
    if(focusedSection === this.state.focusedSection) return;
    this.setState(s => ({ ...s, focusedSection }));
  }

  onActivityToggled(focusedActivity){
    this.setState(s => ({...s, focusedActivity}));
  }

  reload(){
    Helper.fetchDeployment(this);
    Helper.fetchMatching(this);
  }
}

const DeploymentShow = AuthenticatedComponent.compose(
  ErrComponent.compose(
    DeploymentShowClass
  )
);

export default DeploymentShow;