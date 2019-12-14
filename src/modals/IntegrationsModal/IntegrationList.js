import PropTypes from 'prop-types';
import React from 'react';
import { ModSpinner } from '../../assets/loading-spinner';
import Icon from './../../assets/icons';
import Helper from './Helper';
import { Icon as Ic, Identifier, Status } from './IntegrationListStyles';

function IntegrationItem(props) {
  const delCol = (
    <Icon.Trash className="material-icons" onClick={props.requestDelete}>
      delete_outline
    </Icon.Trash>
  );

  let statusWidget = null;
  switch (props.connected) {
    case null:
    case undefined:
      statusWidget = <ModSpinner size="x-small" />;
      break;
    case true:
      statusWidget = <Status emotion="success">Connected</Status>;
      break;
    case false:
      statusWidget = <Status emotion="fail">Disconnected</Status>;
      break;
    default:
      statusWidget = <ModSpinner size="x-small" />;
  }

  return (
    <tr>
      <td>
        <Ic src={Helper.imgName(props.type)} />
      </td>
      <td>
        <Identifier>{props.identifier}</Identifier>
      </td>
      <td>{statusWidget}</td>
      <td>{delCol}</td>
    </tr>
  );
}

export default function IntegrationList(props) {
  const items = props.items.map(item => (
    <IntegrationItem requestDelete={() => props.requestDelete(item)} key={item.id} {...item} />
  ));

  return (
    <table>
      <tbody>{items}</tbody>
    </table>
  );
}

IntegrationList.propTypes = {
  requestDelete: PropTypes.func.isRequired,
  items: PropTypes.array,
};

IntegrationItem.propTypes = {
  identifier: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  connected: PropTypes.oneOf([true, false]),
};
