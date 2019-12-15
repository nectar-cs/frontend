//@flow
import React, {Fragment} from 'react'
import {In} from 'ui-common'

export default class AuthForm extends React.Component<Props> {
  render() {
    return (
      <Fragment>
        {this.renderField('email', 'email')}
        {this.renderField('password', 'password')}
        {this.renderField('confirm', 'password')}
      </Fragment>
    );
  }

  renderField(name, type) {
    if (this.props[name] == null) return null;

    const parent = this.props.callback;
    const callback = e => {
      parent(name, e.target.value);
    };
    return (
      <In.ContrastInput
        type={type}
        value={this.props[name]}
        onChange={callback}
        placeholder={name}
        required
      />
    );
  }
}

type Props = {
  email: string,
  password: string,
  confirm: string,
  callback: (string, string) => void,
};
