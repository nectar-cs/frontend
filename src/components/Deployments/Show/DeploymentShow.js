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
      focusedSection,
      focusedActivity
    };

    this.setDefaultDetailFn = this.setDefaultDetailFn.bind(this);
    this.onSectionToggled = this.onSectionToggled.bind(this);
    this.defDetailFns = {};
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
    const Sections = () => Helper.sectionClasses.map(Section => (
      <Section
        key={Section.name}
        deployment={this.state.deployment}
        matching={this.state.matching}
        isChosen={Section.name === this.state.focusedSection}
        defaultDetailSetter={this.setDefaultDetailFn}
        onClicked={this.onSectionToggled}
      />
    ));
    return <S.LeftPanel><Sections/></S.LeftPanel>;
  }

  onSectionToggled(sectionName){
    const defSection = Helper.defaultSection.name;
    this.setState(s => {
      const isClosing = sectionName === s.focusedSection;
      const focusedSection = isClosing ? defSection : sectionName;
      return { ...s, focusedSection };
    });
  }

  renderRightSideModal(){
    const { focusedSection, focusedActivity } = this.state;
    const { deployment, matching } = this.state;
    const detailFunc = this.defDetailFns[focusedSection];
    const bundle = { deployment, matching };
    if(!(deployment && detailFunc)) return null;

    return(
      <S.RightPanel>
        { detailFunc(focusedActivity, bundle) }
      </S.RightPanel>
    )
  }

  componentDidMount(){
    Helper.fetchDeployment(this);
    Helper.fetchMatching(this);
  }

  setDefaultDetailFn(name, defaultFn){
    this.defDetailFns[name] = defaultFn;
  }
}

const DeploymentShow = AuthenticatedComponent.compose(
  ErrComponent.compose(
    DeploymentShowClass
  )
);

export default DeploymentShow;