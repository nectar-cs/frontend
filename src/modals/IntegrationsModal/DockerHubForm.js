import React, {Fragment} from "react";
import PropTypes from 'prop-types'
import {InputLine, LineInput} from "../../assets/input-combos";
import {S} from "./IntegrationSectionStyles";
import defaults from "./defaults";
import Backend from "../../utils/Backend";

export default class DockerHubForm extends React.Component{

  constructor(props){
    super(props);
    this.state = { username: '', password: '' };
    this.submit = this.submit.bind(this);
  }

  componentDidMount(){
    this.props.setSubmitPerformer(this.submit);
  }

  submit(){
    const endpoint = `/image_registries/dockerhub`;
    const { username, password } = this.state;
    const payload = { identifier: username, secret: password };
    Backend.raisingPost(endpoint, payload, () => {
      this.props.notifySubmitted();
    });
  }

  render(){
    return(
      <Fragment>
        { this.renderFormInputs() }
        { this.renderApology() }
      </Fragment>
    )
  }

  renderFormInputs(){
    const make = (e, name) => {
      const value = e.target.value;
      this.setState(s => ({...s, [name]: value}));
    };

    return(
      <InputLine>
        <LineInput
          value={this.state.username}
          onChange={(e) => make(e, 'username')}
          placeholder='DockerHub Username'
        />
        <LineInput
          value={this.state.password}
          onChange={(e) => make(e, 'password')}
          placeholder='DockerHub Password'
          type={'password'}
        />
      </InputLine>
    )
  }

  renderApology(){
    return <S.Apology><i>{defaults.dockerApology}</i></S.Apology>;
  }

  static propTypes = {
    setSubmitPerformer: PropTypes.func.isRequired,
    notifySubmitted: PropTypes.func.isRequired
  }
}