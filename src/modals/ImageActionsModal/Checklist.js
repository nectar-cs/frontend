import React from 'react'
import PropTypes from 'prop-types'
import {Detail, Icon, Item, List, Name, Spinner} from "./ChecklistStyles";
import {theme} from "../../assets/constants";
import {ThemeProvider} from "styled-components";

function ChecklistItem(props){

  let thirdItem = null;
  if(props.status === 'working')
    thirdItem = <Spinner/>;
  else if(props.status === 'done')
    thirdItem = <Icon good className='material-icons'>check</Icon>;
  else if(props.status === 'failed')
    thirdItem = <Icon className='material-icons'>bug_report</Icon>;

  return(
    <ThemeProvider theme={theme}>
      <li>
        <Item>
          <Name>{props.name}: </Name>
          <Detail>{props.detail}</Detail>
          { thirdItem }
        </Item>
      </li>
    </ThemeProvider>
  )
}

ChecklistItem.propTypes = {
  name: PropTypes.string.isRequired,
  detail: PropTypes.string,
  status: PropTypes.oneOf(['working', 'done', 'failed'])
};

export default function Checklist(props) {
  const itemComponents = props.items.map(item => (
    <ChecklistItem
      key={item.name}
      {...item}
    />
  ));

  return(
    <List>
      { itemComponents }
    </List>
  );
}

Checklist.propTypes = {
  items: PropTypes.arrayOf(ChecklistItem.propTypes)
};
