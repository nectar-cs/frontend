import s from './TopBar.sass'
import { connect } from "react-redux";
import React from 'react';

class TopBarClass extends React.Component {
  render(){
    return(
      <div className={s.topBar}>
      </div>
    )
  }
}

function mapStateToProps(reduxState){
  return reduxState;
}

const connector = connect(mapStateToProps, null);
const TopBar = connector(TopBarClass);
export default TopBar;