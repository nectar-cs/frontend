import s from './SideBar.sass'
import { connect } from "react-redux";
import React from 'react';
import MiscUtils from '../../../utils/MiscUtils';

class SideBarClass extends React.Component {
  render(){
    const image = MiscUtils.image('nectar_mark_light.png');
    return(
      <div className={s.sideBar}>
        <div className={s.logoBox}>
          <img className={s.titleLogo} src={image} alt={"Nectar Mosaic"}/>
          <h1 className={s.titleText}>Mosaic</h1>
        </div>
      </div>
    )
  }
}

function mapStateToProps(reduxState){
  return reduxState;
}

const connector = connect(mapStateToProps, null);
const SideBar = connector(SideBarClass);
export default SideBar;