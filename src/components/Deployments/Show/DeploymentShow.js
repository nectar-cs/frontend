import React from 'react'
import PropTypes from 'prop-types'
import S from './ShowStyles'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ErrComponent from "../../../hocs/ErrComponent";

class DeploymentShowClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isFetch: { dep: false, match: false }
    };
  }

  render(){
    return(
      <S.Container>
        <p>Hey</p>
      </S.Container>
    )
  }

  componentDidMount(){
    this.fetchDeployment();
    this.fetchMatching();
  }

  fetchDeployment(){
    this.setFetch({dep: true});
  }

  fetchMatching(){
    this.setFetch({match: true});
  }

  setFetch(assign){
    this.setState(s => ({...s, isFetch: {...s.isFetch, ...assign}}));
  }

  depName(){ return this.props.match.params['id'] }
  depNs(){ return this.props.match.params['ns'] }
}

const DeploymentShow = AuthenticatedComponent.compose(
  ErrComponent.compose(
    DeploymentShowClass
  )
);

export default DeploymentShow;