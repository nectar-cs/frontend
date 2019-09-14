import React from 'react'
import PropTypes from 'prop-types'
import {Icon, Identifier, Status, Trash} from "./IntegrationListStyles";
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
      statusWidget = <Status emotion='success'>Connected</Status>;
      break;
    case false:
      statusWidget = <Status emotion='fail'>Disconnected</Status>;
  }

  return(
    <tr>
      <td><Icon src={Helper.imgName(props.type)}/></td>
      <td><Identifier>{props.identifier}</Identifier></td>
      <td>{statusWidget}</td>
      <td>{delCol}</td>
    </tr>
  )
}

export default function IntegrationList(props){
  const items = props.items.map(item => (
    <IntegrationItem
      requestDelete={() => props.requestDelete(item.id)}
      key={item.id}
      {...item}
    />
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

IntegrationList.propTypes = {
  requestDelete: PropTypes.func.isRequired,
  items: PropTypes.array
};

IntegrationItem.propTypes = {
  identifier: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  connected: PropTypes.oneOf([true, false])
};