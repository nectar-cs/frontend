import React from 'react';
import {S} from "./TopBarStyles";

function SearchInput(){
  return <S.Search/>;
}

export default function TopBar() {
  return(
    <S.Container>
      <SearchInput/>
    </S.Container>
  )
}