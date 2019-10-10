import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ErrComponent from "../../../hocs/ErrComponent";
import Helper from "./Helper";
import Layout from "../../../assets/layouts";
import S from './DeploymentShowStyles'

class DeploymentShowClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isFetch: { dep: false, match: false },
      deployment: null,
      matching: null,
      focusedSection: Helper.defaultSection.name
    };

    this.setDefaultDetailFn = this.setDefaultDetailFn.bind(this);
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
    return Helper.sectionClasses.map(Section => (
      <Section
        key={Section.name}
        deployment={this.state.deployment}
        matching={this.state.matching}
        isFocused={false}
        defaultDetailSetter={this.setDefaultDetailFn}
      />
    ));
  }

  renderDetail(){
    return <S.RightPanel><p>ho</p></S.RightPanel>
  }

  componentDidMount(){
    Helper.fetchDeployment(this);
    Helper.fetchMatching(this);
  }

  setFetch(assign){
    this.setState(s => ({...s, isFetch: {...s.isFetch, ...assign}}));
  }

  setDefaultDetailFn(klass, defaultFn){
    this.defDetailFns[klass.name] = defaultFn;
  }
}

const DeploymentShow = AuthenticatedComponent.compose(
  ErrComponent.compose(
    DeploymentShowClass
  )
);

export default DeploymentShow;