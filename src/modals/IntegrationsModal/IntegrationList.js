import React from 'react'
import {Icon, Trash} from "./IntegrationListStyles";
import {theme} from "../../assets/constants";
import {ThemeProvider} from "styled-components";
import Helper from "./Helper";
import {StatusTag} from "../../assets/text-combos";
import {ModSpinner} from "../../assets/loading-spinner";

function IntegrationItem(props) {
  const delCol = (
    <Trash
      className='material-icons'
      onClick={props.requestDelete}>
      delete_outline
    </Trash>
  );

  let statusWidget = null;
  switch(props.connected){
    case null:
    case undefined:
      statusWidget = <ModSpinner size='x-small'/>;
      break;
    case true:
      statusWidget = <StatusTag emotion='success'>Authenticated</StatusTag>;
      break;
    case false:
      statusWidget = <StatusTag emotion='fail'>Broken</StatusTag>;
  }

  return(
    <tr>
      <td><Icon src={Helper.imgName(props.type)}/></td>
      <td><p>{props.identifier}</p></td>
      <td>{statusWidget}</td>
      <td>{delCol}</td>
    </tr>
  )
}

export default function IntegrationList(props){
  const items = props.items.map(item => (
    <IntegrationItem key={item.id} {...item}/>
  ));

  return(
    <ThemeProvider theme={theme}>
      <table>
        <tbody>
        { items }
        </tbody>
      </table>
    </ThemeProvider>
  )
}