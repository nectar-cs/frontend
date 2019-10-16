import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Separator, Tab, TabsLayout} from "./TabStyles";

export default class Tabs extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      selectedInd: props.selectedInd
    };
  }

  render(){
    return(
      <Fragment>
        <TabsLayout>
          { this.props.tabs.map((t, i) => this.renderTab(t, i)) }
        </TabsLayout>
        <Separator/>
        { this.props.children[this.state.selectedInd] }
        <br/>
      </Fragment>
    )
  }

  onTabSelected(index){
    this.setState(s => ({...s, selectedInd: index}));
    this.props.onTabChanged && this.props.onTabChanged(index);
  }

  renderTab(tab, index){
    return(
      <Tab
        selected={index === this.state.selectedInd}
        key={index}
        onClick={() => this.onTabSelected(index)}>
        {tab}
      </Tab>
    )
  }

  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedInd: PropTypes.number,
    onTabChanged: PropTypes.func
  }
}