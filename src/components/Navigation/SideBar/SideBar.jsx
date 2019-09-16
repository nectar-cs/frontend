import s from './SideBar.sass'
import { connect } from "react-redux";
import React, {Fragment} from 'react';
import MiscUtils from '../../../utils/MiscUtils';
import sections from './sections'
import ModalHostComposer from "../../../hocs/ModalHostComposer";

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
    return(
      <div className={s.itemRow}>
        <i className={`material-icons ${s.subSectionToggle}`}>keyboard_arrow_down</i>
        { this.props.path ? this.renderHref() : this.renderModalAction() }
      </div>
    )
  }
}

class SideBarSection extends React.Component {
  render(){
    return(
      <Fragment>
        <div className={s.sectionRow}>
          <i className={`material-icons ${s.sectionIcon}`}>{this.props.icon}</i>
          <p className={s.sectionTitle}>{this.props.title}</p>
        </div>
        <div className={s.subSection}>
          { this.renderItems() }
        </div>
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
      <div className={s.sideBar}>
        <div className={s.logoBox}>
          <img className={s.titleLogo} src={image} alt={"Nectar Mosaic"}/>
          <h1 className={s.titleText}>Mosaic</h1>
          </div>
        <div className={s.content}>
          { this.renderSections() }
        </div>
      </div>
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