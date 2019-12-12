import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import In from '../../assets/input-combos';
import { S } from './IntegrationSectionStyles';
import defaults from './defaults';
import Backend from '../../utils/Backend';
import Utils from '../../utils/Utils';

export default class DockerHubForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.props.setSubmitPerformer(this.submit);
  }

  render() {
    return (
      <Fragment>
        {this.renderFormInputs()}
        {this.renderApology()}
      </Fragment>
    );
  }

  submit() {
    const endpoint = `/remotes/dockerhub`;
    const { username, password } = this.state;
    const payload = { identifier: username, secret: password };
    Utils.mp('Integration Create', { type: 'DockerHub', entity: 'docker' });
    Backend.post(endpoint, payload, this.props.notifySubmitted);
  }

  renderFormInputs() {
    const make = (e, name) => {
      const value = e.target.value;
      this.setState(s => ({ ...s, [name]: value }));
    };

    return (
      <In.InputLine>
        <In.LineInput
          value={this.state.username}
          onChange={e => make(e, 'username')}
          placeholder="DockerHub Username"
        />
        <In.LineInput
          value={this.state.password}
          onChange={e => make(e, 'password')}
          placeholder="DockerHub Password"
          type={'password'}
        />
      </In.InputLine>
    );
  }

  renderApology() {
    return (
      <S.Apology>
        <i>{defaults.dockerApology}</i>
      </S.Apology>
    );
  }

  static propTypes = {
    setSubmitPerformer: PropTypes.func.isRequired,
    notifySubmitted: PropTypes.func.isRequired,
  };
}
