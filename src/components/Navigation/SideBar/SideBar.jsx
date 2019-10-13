import React, {Fragment} from 'react';
import S from './SideBarStyles'
import s from './SideBar.sass'
import { connect } from "react-redux";
import MiscUtils from '../../../utils/MiscUtils';
import sections from './sections'
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import Micon from "../../../widgets/Micon/Micon";
import {theme} from "../../../assets/constants";

class SideBarSubItem extends React.Component{}

class SideBarItem extends React.Component {

  renderHref(){
    return(
      <a className={s.item} href={this.props.path}>
        <p className={s.itemText}>{this.props.title}</p>
      </a>
    )
  }

  renderModalAction(){
    const action = () => this.props.openModal(this.props.modal);
    return(
      <p className={s.itemText} onClick={action}>{this.props.title}</p>
    )
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

class SideBarSection extends React.Component {
  render(){

    const { title, icon } = this.props;

    return(
      <Fragment>
        <S.SectionRow>
          <Micon n={icon} e={S.sectionIcon(theme)}/>
          <S.SectionTitle>{title}</S.SectionTitle>
        </S.SectionRow>
        <S.SubSection>{ this.renderItems() }</S.SubSection>
      </Fragment>
    )
  }

  renderItems(){
    return this.props.items.map((item) => (
      <SideBarItem
        key={item.title}
        {...item}
        openModal={this.props.openModal}
      />
    ));
  }
}

class SideBarClass extends React.Component {
  render(){
    const image = MiscUtils.image('nectar_mark_light.png');
    return(
      <S.Sidebar>
        <S.LogoBox>
          <S.TitleLogo src={image} alt={"Nectar Mosaic"}/>
          <S.TitleText>Mosaic</S.TitleText>
        </S.LogoBox>
        <S.Content>
          { this.renderSections() }
        </S.Content>
      </S.Sidebar>
    )
  }

  renderSections(){
    return sections.map((section) => (
      <SideBarSection
        key={section.title}
        openModal={this.props.openModal}
        {...section}
      />
    ))
  }
}

function mapStateToProps(reduxState){
  return reduxState;
}

const connector = connect(mapStateToProps, null);
const SideBar = ModalHostComposer.compose(
  connector(SideBarClass)
);
export default SideBar;