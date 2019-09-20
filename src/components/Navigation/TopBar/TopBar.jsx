import { connect } from "react-redux";
import React from 'react';
import {S} from "./TopBarStyles";

function SearchInput(){
  return(
    <S.Search/>
  )
}

class TopBarClass extends React.Component {
  render(){
    return(
      <S.Container>
        <SearchInput/>
      </S.Container>
    )
  }
}

function mapStateToProps(reduxState){
  return reduxState;
}

const connector = connect(mapStateToProps, null);
const TopBar = connector(TopBarClass);
export default TopBar;