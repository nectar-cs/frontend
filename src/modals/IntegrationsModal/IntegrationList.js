import React from 'react'
import {Icon, Trash} from "./IntegrationListStyles";
import {theme} from "../../assets/constants";
import {ThemeProvider} from "styled-components";
import Helper from "./Helper";
import {StatusTag} from "../../assets/text-combos";

function IntegrationItem(props) {

  const delCol = (
    <Trash
      className='material-icons'
      onClick={props.requestDelete}>
      delete_outline
    </Trash>
  );

  return(
    <tr>
      <td><Icon src={Helper.imgName(props.type)}/></td>
      <td><p>{props.identifier}</p></td>
      <td><StatusTag>Working</StatusTag></td>
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

