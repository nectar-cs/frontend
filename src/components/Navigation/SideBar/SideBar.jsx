import React, {Fragment} from 'react';
import S from './SideBarStyles'
import { connect } from "react-redux";
import MiscUtils from '../../../utils/MiscUtils';
import sections from './sections'
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import Micon from "../../../widgets/Micon/Micon";
import {theme} from "../../../assets/constants";

class SideBarSubItem extends React.Component{}

class SideBarItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false
    }
  }

  renderHref(){
    const { path, title } = this.props;
    return(
      <S.Item href={path}>
        <S.ItemText>{title}</S.ItemText>
      </S.Item>
    )
  }

  renderModalAction(){
    const { modal, openModal, title } = this.props;
    const action = () => openModal(modal);
    return<S.ItemText onClick={action}>{title}</S.ItemText>;
  }

  render(){
    const { path } = this.props;
    const Item = () => path ? this.renderHref() : this.renderModalAction();
    return(
      <S.ItemRow>
        <Micon n='keyboard_arrow_down' e={S.arrow(theme)}/>
        <Item/>
      </S.ItemRow>
    )
  }
}

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