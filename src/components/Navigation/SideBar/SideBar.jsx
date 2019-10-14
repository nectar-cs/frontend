import React, {Fragment} from 'react';
import S from './SideBarStyles'
import { connect } from "react-redux";
import MiscUtils from '../../../utils/MiscUtils';
import sections from './sections'
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import Micon from "../../../widgets/Micon/Micon";
import {theme} from "../../../assets/constants";
import Text from "../../../assets/text-combos";

function SideBarSubItem({name, url}){
  return(
    <S.SubItem>
      <Text.A href={url}>
        <S.SubItemText>{name}</S.SubItemText>
      </Text.A>
    </S.SubItem>
  )
}

class SideBarItemClass extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: !!props.eager
    };
    this.toggle =  this.toggle.bind(this);
  }

  renderHref(){
    const { path, title } = this.props;
    return(
      <Text.A href={path}>
        <S.ItemText>{title}</S.ItemText>
      </Text.A>
    )
  }

  renderModalAction(){
    const { modal, openModal, title } = this.props;
    const action = () => openModal(modal);
    return<S.ItemText onClick={action}>{title}</S.ItemText>;
  }

  renderIcon(){
    const { isExpanded } = this.state;
    return(
      <Micon
        callback={this.toggle}
        n={`keyboard_arrow_${isExpanded ? 'up' : 'down'}`}
        e={S.arrow(theme)}
      />
    )
  }

  renderGrandchildren(){
    if(!this.state.isExpanded) return null;
    const content = this.props[this.props.identifier];
    if(!content || content.length < 1) return null;

    return(
      <S.SubItemsContainer>
        { content.map(w => <SideBarSubItem key={w.id} {...w} />) }
      </S.SubItemsContainer>
    )
  }

  render(){
    const { path } = this.props;
    return(
      <Fragment>
        <S.ItemRow>
          { this.renderIcon() }
          { path ? this.renderHref() : this.renderModalAction() }
        </S.ItemRow>
        { this.renderGrandchildren() }
      </Fragment>
    )
  }

  toggle(){
    this.setState(s => ({...s, isExpanded: !s.isExpanded}));
  }
}

function s2P(state){
  const workspaces = state.mainReducer.workspaces.map(w => ({
    id: w.id,
    name: w.name,
    url: `/workspaces/${w.id}`
  })).slice(0, 3);

  return { workspaces };
}

const SideBarItem = connect(s2P)(SideBarItemClass);

function SideBarItems(props){
  return props.items.map((item) => (
    <SideBarItem
      key={item.title}
      {...item}
      openModal={props.openModal}
    />
  ));
}

function SideBarSection(props) {
  const { title, icon } = props;
  return(
    <Fragment>
      <S.SectionRow>
        <Micon n={icon} e={S.sectionIcon(theme)}/>
        <S.SectionTitle>{title}</S.SectionTitle>
      </S.SectionRow>
      <S.SubSection>
        <SideBarItems {...props} />
      </S.SubSection>
    </Fragment>
  )
}

function Sections (props) {
  return sections.map((section) => (
    <SideBarSection
      key={section.title}
      openModal={props.openModal}
      {...section}
    />
  ))
}

function SideBarClass(props) {
  const image = MiscUtils.image('nectar_mark_light.png');
  return(
    <S.Sidebar>
      <S.LogoBox>
        <S.TitleLogo src={image} alt={"Nectar Mosaic"}/>
        <S.TitleText>Mosaic</S.TitleText>
      </S.LogoBox>
      <S.Content>
        <Sections {...props}/>
      </S.Content>
    </S.Sidebar>
  )
}

function mapStateToProps(reduxState){
  return reduxState;
}

const connector = connect(mapStateToProps, null);
const SideBar = ModalHostComposer.compose(
  connector(SideBarClass)
);
export default SideBar;