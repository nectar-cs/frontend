import React from 'react'
import Backend from "../../utils/Backend";
import Helper from "./Helper";
import PropTypes from 'prop-types'

function HistoryRow(props){
  return(
    <tr>
      <td><p>sup</p></td>
    </tr>
  )
}

HistoryRow.propTypes = {
  command: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired
};

export default class CommandHistory extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      items: []
    };
    this.applyHistory = this.applyHistory.bind(this);
  }

  componentDidMount(){
    Helper.reloadHistory(this, this.applyHistory);
  }

  applyHistory(items){
    this.setState(s => ({...s, items}));
  }

  renderItems(){
    return this.state.items.map(item => (
      <HistoryRow
        key={item.command}
        {...item}
      />
    ));
  }

  render(){
    return(
      <table>
        <tbody>
        { this.renderItems() }
        </tbody>
      </table>
    )
  }
}