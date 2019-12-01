import React, { Fragment } from 'react';
import TextOverLineSubtitle from '../TextOverLineSubtitle/TextOverLineSubtitle';

export default class VertSection extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: props.startExpanded,
    };
  }

  render() {
    return (
      <Fragment>
        {this.renderTitle()}
        {this.renderChildren()}
      </Fragment>
    );
  }

  renderTitle() {
    const { title } = this.props;
    const { isExpanded } = this.state;

    return (
      <TextOverLineSubtitle
        text={title}
        toggleOpen={isExpanded}
        callback={() => this.toggleExpanded()}
      />
    );
  }

  renderChildren() {
    const { children } = this.props;
    const { isExpanded } = this.state;
    return isExpanded ? children : null;
  }

  toggleExpanded() {
    this.setState(s => ({ ...s, isExpanded: !s.isExpanded }));
  }

  static defaultProps = {
    startExpanded: true,
  };
}

type Props = {
  title: string,
  startExpanded: ?boolean,
};
