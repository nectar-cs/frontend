import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import S from './TabStyles';

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedInd: props.defaultIndex || 0,
    };
  }

  render() {
    const { selectedInd } = this.state;
    return (
      <Fragment>
        <S.TabsLayout>{this.props.tabs.map((t, i) => this.renderTab(t, i))}</S.TabsLayout>
        <S.Separator />
        {this.props.children[selectedInd]}
        <br />
      </Fragment>
    );
  }

  onTabSelected(index) {
    this.setState(s => ({ ...s, selectedInd: index }));
    this.props.onTabChanged && this.props.onTabChanged(index);
  }

  renderTab(tab, index) {
    return (
      <S.Tab
        selected={index === this.state.selectedInd}
        key={index}
        onClick={() => this.onTabSelected(index)}
      >
        {tab}
      </S.Tab>
    );
  }

  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultIndex: PropTypes.number,
    onTabChanged: PropTypes.func,
  };
}
