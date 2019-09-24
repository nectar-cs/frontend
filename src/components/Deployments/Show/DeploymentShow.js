import React from 'react'
import PropTypes from 'prop-types'
import S from './ShowStyles'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ErrComponent from "../../../hocs/ErrComponent";
import Kapi from "../../../utils/Kapi";
import DataUtils from "../../../utils/DataUtils";
import LeftHeader from "../../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../../utils/MiscUtils";

class DeploymentShowClass extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isFetch: { dep: false, match: false },
      deployment: null,
      matching: null
    };
  }

  render(){
    return(
      <S.Container>
        { this.renderHeader() }
      </S.Container>
    )
  }

  renderHeader(){
    const { deployment, matching } = this.state;
    if(!deployment) return null;
    const subtitle = matching ? MiscUtils.gitSummary(matching) : '';

    return(
      <LeftHeader
        graphicName={MiscUtils.msImage(deployment, matching)}
        title={`${this.depNs()} / ${deployment.name}`}
        subtitle={subtitle}
      />
    )
  }

  componentDidMount(){
    this.fetchDeployment();
    this.fetchMatching();
  }

  fetchDeployment(){
    this.setFetch({dep: true});
    const ep = `/api/deployments/${this.depNs()}/${this.depName()}`;
    Kapi.fetch(ep, resp => {
      this.setFetch({dep: false});
      const deployment = DataUtils.objKeysToCamel(resp);
      this.setState(s => ({...s, deployment}));
    });
  }

  fetchMatching(){
    this.setFetch({match: true});
    const ep = `/api/deployments/${this.depNs()}/${this.depName()}`;
    Kapi.fetch(ep, resp => {
      this.setFetch({match: false});
      const matching = DataUtils.objKeysToCamel(resp);
      this.setState(s => ({...s, matching}));
    });
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