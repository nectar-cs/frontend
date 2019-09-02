import React from 'react'
import PropTypes from 'prop-types'
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";

export default class HistoryList extends React.Component {

  constructor(props){
    super(props);
    this._isMounted = true;
    this.state = { history: [] }
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

  renderItems(){
    return this.state.history.map(h => (
      <HistoryRow {...h['extras']} />
    ));
  }

  componentDidMount(){
    const args = `name=${this.props.name}&namespace=${this.props.namespace}`;
    const url = `/dep_attachments?${args}`;
    Backend.raisingFetch(url, (resp) => {
      if(this._isMounted)
        this.setState(s => ({
          ...s,
          history: DataUtils.objKeysToCamel(resp['data'])
        }))
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  propTypes = {
    name: PropTypes.string.isRequired,
    namespace: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
  }
}

class HistoryRow extends React.Component {

  render(){
    return(
      <tr>
        <td><p>{this.props.path}</p></td>
        <td><p>{this.props.verb}</p></td>
      </tr>
    )
  }

  static propTypes = {
    path: PropTypes.string.isRequired,
    verb: PropTypes.string.isRequired,
    headers: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.string,
    lastStatus: PropTypes.number
  };
}