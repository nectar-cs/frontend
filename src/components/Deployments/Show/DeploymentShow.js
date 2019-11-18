import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ErrComponent from "../../../hocs/ErrComponent";
import Helper from "./Helper";
import S from './DeploymentShowStyles'
import UpdateCheckComposer from "../../../hocs/UpdateCheckComposer";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import CenterLoader from "../../../widgets/CenterLoader/CenterLoader";

class DeploymentShowClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      deployment: null,
      matching: null,
      commit: null,
      isInitialFetching: true,
      focusedSection: Helper.defaultSection,
      detailOverride: null,
      matchingBackOff: 0
    };

    this.setDefaultDetailFn = this.setDefaultDetailFn.bind(this);
    this.onSectionToggled = this.onSectionToggled.bind(this);
    this.overrideDetail = this.overrideDetail.bind(this);
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
        { this.renderRightSideOverride() }
      </Fragment>
    )
  }

  renderInitialFetching(){
    if(!this.isInitialFetching()) return null;
    return <CenterLoader/>;
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
    const { deployment, matching, detailOverride } = this.state;
    const { overrideDetail } = this;
    const { focusedSection } = this.state;
    const detailComp = this.defDetailFns[focusedSection];
    const bundle = { deployment, matching, overrideDetail };
    if(detailOverride || !(deployment && detailComp)) return null;

    return(
      <S.RightPanel>
        { detailComp(bundle) }
      </S.RightPanel>
    )
  }

  renderRightSideOverride(){
    const { detailOverride: Override } = this.state;
    if(!Override) return null;
    return <S.RightPanel><Override/></S.RightPanel>;
  }

  setDefaultDetailFn(name, defaultFn){
    this.defDetailFns[name] = defaultFn;
  }

  overrideDetail(detailOverride){
    this.setState(s => ({...s, detailOverride}));
  }

  onSectionToggled(focusedSection){
    if(focusedSection === this.state.focusedSection) return;
    this.setState(s => ({ ...s, focusedSection, detailOverride: null }));
  }

  async reloadLoop(){
    while(!this._willUnmount){
      await this.reload();
      await this.pollWait();
    }
  }

  async reload(){
    let { matching, matchingBackOff } = this.state;
    const { ns, id: name } = this.props.match.params;
    const deployment = await Helper.fetchDeployment(ns, name);
    this.update({deployment, isInitialFetching: false});

    if(matchingBackOff < 1) {
      matching = await Helper.fetchMatching(name);
      matchingBackOff = matching ? 5 : 20;
    } else matchingBackOff -= 1;

    this.update({matching, matchingBackOff});
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