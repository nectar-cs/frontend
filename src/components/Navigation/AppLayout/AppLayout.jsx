import React from 'react';
import SideBar from './../SideBar/SideBar'
import TopBar from './../TopBar/TopBar'
import s from './AppLayout.sass'

export default class AppLayout extends React.Component {
  render(){
    return(
      <React.Fragment>
        <TopBar/>
        <SideBar/>
        <div className={s.appContent}>
          { this.props.children }
        </div>
      </React.Fragment>
    )
  }
}