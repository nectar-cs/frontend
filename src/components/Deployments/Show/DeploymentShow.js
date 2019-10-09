import React from 'react'
import AuthenticatedComponent from "../../../hocs/AuthenticatedComponent";
import ErrComponent from "../../../hocs/ErrComponent";
import Kapi from "../../../utils/Kapi";
import Backend from "../../../utils/Backend";
import DataUtils from "../../../utils/DataUtils";
import LeftHeader from "../../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../../utils/MiscUtils";
import Layout from "../../../assets/layouts";

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
      <Layout.FullWidthPanel>
        { this.renderHeader() }
      </Layout.FullWidthPanel>
    )
  }

  renderHeader(){
    const { deployment, matching } = this.state;
    if(!deployment) return null;

    return(
      <LeftHeader
        graphicName={MiscUtils.msImage(deployment, matching)}
        title={`${this.depNs()} / ${deployment.name}`}
        subtitle={matching && MiscUtils.gitSummary(matching)}
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
    const ep = `/microservices/${this.depNs()}/${this.depName()}`;
    Backend.raisingFetch(ep, resp => {
      this.setFetch({match: false});
      const matching = DataUtils.objKeysToCamel(resp)['data'];
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