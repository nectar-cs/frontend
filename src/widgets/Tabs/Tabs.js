import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import s from './Tabs.sass'
import Prism from "prismjs";

export default class Tabs extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      selectedInd: props.selectedInd
    };
  }

  componentDidMount(){
    Prism.highlightAll();
  }

  render(){
    return(
      <Fragment>
        <div className={s.tabs}>
          { this.props.tabs.map((t, i) => this.renderTab(t, i)) }
        </div>
        <div className={s.separator}/>
        { this.props.children[this.state.selectedInd] }
      </Fragment>
    )
  }

  onTabSelected(index){
    this.setState(s => ({...s, selectedInd: index}))
  }

  renderTab(tab, index){
    const tabClass = index === this.state.selectedInd ? s.tabSel : s.tab;
    return(
      <p
        key={index}
        className={tabClass}
        onClick={() => this.onTabSelected(index)}>
        {tab}
      </p>
    )
  }

  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedInd: PropTypes.number
  }

}
