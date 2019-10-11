import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ErrComponent from "../../../hocs/ErrComponent";
import Helper from "./Helper";
import S from './DeploymentShowStyles'

class DeploymentShowClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      deployment: null,
      matching: null,
      focusedSection: Helper.defaultSection.name
    };

    this.setDefaultDetailFn = this.setDefaultDetailFn.bind(this);
    this.onClicked = this.onClicked.bind(this);
    this.defDetailFns = {};
  }

  render(){
    return(
      <Fragment>
        { this.renderSections() }
        { this.renderDetail() }
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
        onClicked={this.onClicked}
      />
    ));
    return <S.LeftPanel><Sections/></S.LeftPanel>;
  }

  onClicked(sectionName){
    const defSection = Helper.defaultSection.name;
    this.setState(s => {
      const isClosing = sectionName === s.focusedSection;
      const focusedSection = isClosing ? defSection : sectionName;
      return { ...s, focusedSection };
    });
  }

  renderDetail(){
    const {deployment, focusedSection, matching} = this.state;
    const detailFunc = this.defDetailFns[focusedSection];
    const bundle = { deployment, matching };
    return(
      <S.RightPanel>
        { deployment && detailFunc && detailFunc(bundle) }
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