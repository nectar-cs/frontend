import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ErrComponent from "../../../hocs/ErrComponent";
import Helper from "./Helper";
import S from './DeploymentShowStyles'
import UpdateCheckComposer from "../../../hocs/UpdateCheckComposer";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import Layout from "../../../assets/layouts";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";

class DeploymentShowClass extends React.Component{

  constructor(props){
    super(props);
    const focusedSection = Helper.defaultSection;

    this.state = {
      deployment: null,
      matching: null,
      commit: null,
      isInitialFetching: true,
      focusedSection
    };

    this.setDefaultDetailFn = this.setDefaultDetailFn.bind(this);
    this.onSectionToggled = this.onSectionToggled.bind(this);
    this.reload = this.reload.bind(this);
    this.defDetailFns = {};
  }

  componentDidMount(){
    this.reloadLoop();
    const { ns, id: name } = this.props.match.params;
    document.title = `${ns}/${name}`;
  }

  render(){
    return(
      <Fragment>
        { this.renderInitialFetching() }
        { this.renderSections() }
        { this.renderRightSideModal() }
      </Fragment>
    )
  }

  renderInitialFetching(){
    if(!this.isInitialFetching()) return null;
    return(
      <Layout.FullWidthPanel>
        <CenterLoader/>
      </Layout.FullWidthPanel>
    )
  }

  renderSections(){
    if(this.isInitialFetching()) return null;
    const { deployment, matching  } = this.state;
    const { focusedSection } = this.state;
    const Sections = () => Helper.sectionClasses.map(Section => (
      <Section
        key={Section._className()}
        deployment={deployment}
        matching={matching}
        isChosen={Section._className() === focusedSection}
        defaultDetailSetter={this.setDefaultDetailFn}
        onClicked={this.onSectionToggled}
        refreshCallback={this.reload}
      />
    ));
    return <S.LeftPanel><Sections/></S.LeftPanel>;
  }

  renderRightSideModal(){
    const { deployment, matching } = this.state;
    const { focusedSection } = this.state;
    const detailFunc = this.defDetailFns[focusedSection];
    const bundle = { deployment, matching };
    if(!(deployment && detailFunc)) return null;

    return(
      <S.RightPanel>
        { detailFunc(bundle) }
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

  async reloadLoop(){
    while(!this._willUnmount){
      await this.reload();
      await this.pollWait();
    }
  }

  async reload(){
    const { ns, id: name } = this.props.match.params;
    const deployment = await Helper.fetchDeployment(ns, name);
    this.update({deployment, isInitialFetching: false});
    const matching = await Helper.fetchMatching(name);
    this.update({matching});
  }

  update(assignments){ this.setState(s => ({...s, ...assignments})); }
  isInitialFetching(){ return this.state.isInitialFetching; }
  componentWillUnmount(): * { this._willUnmount = true; }
  async pollWait() {return new Promise(r => setTimeout(r, 5000));}
}

const DeploymentShow = AuthenticatedComponent.compose(
  ModalHostComposer.compose(
    UpdateCheckComposer.compose(
      ErrComponent.compose(
        DeploymentShowClass
      )
    )
  )
);

export default DeploymentShow;