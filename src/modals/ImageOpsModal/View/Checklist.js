import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Detail, Icon, Item, List, Name, Spinner } from './ChecklistStyles';
import TextOverLineSubtitle from '../../../widgets/TextOverLineSubtitle/TextOverLineSubtitle';

function ChecklistItem(props) {
  let thirdItem;
  if (props.status === 'working') thirdItem = <Spinner size="x-small" />;
  else if (props.status === 'done')
    thirdItem = (
      <Icon emotion={'good'} className="material-icons">
        check
      </Icon>
    );
  else if (props.status === 'failed')
    thirdItem = <Icon className="material-icons">bug_report</Icon>;
  else thirdItem = null;

  return (
    <li>
      <Item>
        <Name>{props.name}: </Name>
        <Detail>{props.detail}</Detail>
        {thirdItem}
      </Item>
    </li>
  );
}

ChecklistItem.propTypes = {
  name: PropTypes.string.isRequired,
  detail: PropTypes.string,
  status: PropTypes.oneOf(['working', 'done', 'failed', 'idle']),
};

export default function Checklist(props) {
  const itemComponents = props.items.map(item => <ChecklistItem key={item.name} {...item} />);

  return (
    <Fragment>
      <TextOverLineSubtitle text="Progress" />
      <List>{itemComponents}</List>
    </Fragment>
  );
}

Checklist.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(ChecklistItem.propTypes)),
};
