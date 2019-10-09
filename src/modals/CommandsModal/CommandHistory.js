import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import S from './CommandHistoryStyles'
import Text from './../../assets/text-combos'
import Icon from './../../assets/icons'
import Helper from "./Helper";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import defaults from "./defaults";


function HistoryRow(props){
  const status = props.status;
  const emotion = status === 0 ? 'good' : 'warn';

  const trash = (
    <Icon.Trash
      className='material-icons'
      onClick={props.deleteCallback}>
      delete_outline
    </Icon.Trash>
  );

  return(
    <tr>
      <td><Text.ContrastCode>{props.command}</Text.ContrastCode></td>
      <td><Text.StatusTag emotion={emotion}>Code {props.status}</Text.StatusTag></td>
      <td>{trash}</td>
    </tr>
  )
}

HistoryRow.propTypes = {
  command: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  deleteCallback: PropTypes.func.isRequired
};

export default class CommandHistory extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      items: []
    };
    this.applyHistory = this.applyHistory.bind(this);
    this.reloadHistory = this.reloadHistory.bind(this);
    props.setReloadTrigger(this.reloadHistory);
  }

  componentDidMount(){
    this.reloadHistory()
  }

  render(){
    return(
      <Fragment>
        <TextOverLineSubtitle text='History'/>
        <S.Table>
          <tbody>
          { this.renderItems() }
          </tbody>
        </S.Table>
      </Fragment>
    )
  }

  applyHistory(items){
    this.setState(s => ({...s, items}));
  }

  renderItems(){
    return this.state.items.map(item => (
      <HistoryRow
        key={item.id}
        deleteCallback={() => this.deleteItem(item.id)}
        {...item.extras}
      />
    ));
  }

  reloadHistory(){
    Helper.reloadHistory(this, this.applyHistory);
  }

  deleteItem(id){
    if(window.confirm(defaults.sectionThree.confirmDelete)) {
      Helper.deleteCommand(this, id, this.reloadHistory);
    }
  }

  static propTypes = {
    setReloadTrigger: PropTypes.func.isRequired
  }
}