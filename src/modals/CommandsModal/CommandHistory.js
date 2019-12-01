import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import S from './CommandHistoryStyles';
import Text from './../../assets/text-combos';
import Icon from './../../assets/icons';
import Helper from './Helper';
import TextOverLineSubtitle from '../../widgets/TextOverLineSubtitle/TextOverLineSubtitle';

function HistoryRow(props) {
  const status = props.status;
  const emotion = status === 0 ? 'good' : 'warn';

  const Trash = () => (
    <Icon.Trash className="material-icons" onClick={props.deleteCallback}>
      delete_outline
    </Icon.Trash>
  );

  const Command = () => <Text.ContrastCode>{props.command}</Text.ContrastCode>;
  const Status = () => <Text.StatusTag emotion={emotion}>Code ?</Text.StatusTag>;

  return (
    <S.Row onClick={props.selectedCallback}>
      <td>
        <Command />
      </td>
      <td>
        <Status />
      </td>
      <td>
        <Trash />
      </td>
    </S.Row>
  );
}

HistoryRow.propTypes = {
  command: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  deleteCallback: PropTypes.func.isRequired,
  selectedCallback: PropTypes.func.isRequired,
};

export default class CommandHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    this.applyHistory = this.applyHistory.bind(this);
    this.reloadHistory = this.reloadHistory.bind(this);
    props.setReloadTrigger(this.reloadHistory);
  }

  componentDidMount() {
    this.reloadHistory();
  }

  render() {
    return (
      <Fragment>
        <TextOverLineSubtitle text="History" />
        <S.Table>
          <tbody>{this.renderItems()}</tbody>
        </S.Table>
      </Fragment>
    );
  }

  applyHistory(items) {
    this.setState(s => ({ ...s, items }));
  }

  renderItems() {
    return this.state.items.map(item => (
      <HistoryRow
        key={item.id}
        deleteCallback={() => this.deleteItem(item.id)}
        selectedCallback={() => this.applyItem(item)}
        {...item.extras}
      />
    ));
  }

  reloadHistory() {
    Helper.reloadHistory(this, items => {
      this.applyHistory(items);
      // this.applyItem(items[0], false);
    });
  }

  deleteItem(id) {
    Helper.deleteCommand(this, id, this.reloadHistory);
  }

  applyItem(item, erase) {
    if (item) this.props.applyCallback(item.extras, erase);
  }

  static propTypes = {
    setReloadTrigger: PropTypes.func.isRequired,
    applyCallback: PropTypes.func.isRequired,
  };
}
