import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../hocs/AuthenticatedComponent";
import Layout from "../../assets/layouts";
import OverviewSide from "./OverviewSide";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import Helper from './Helper'

class InfraDebugClass extends React.Component {

  constructor(props) {
    super(props);

    const source = ((props.location || {}).state) || {};
    this.state = {
      deployment: source.deployment,
      matching: source.matching,
      isDepFetching: false,
      isMatFetching: false
    };
  }

  componentDidMount(){
    Helper.fetchDeployment(this);
    Helper.fetchMatching(this);
  }

  render(){
    return(
      <Fragment>
        { this.renderOverviewSide() }
        { this.renderActionSide() }
      </Fragment>
    )
  }

  renderOverviewSide(){
    if(!this.ready()) return null;

    const { deployment, matching } = this.state;
    return(
      <Layout.LeftPanel>
        <OverviewSide
          type={this.type()}
          deployment={deployment}
          matching={matching}
        />
      </Layout.LeftPanel>
    )
  }

  renderActionSide(){
    if(!this.ready()) return null;

    return(
      <Layout.RightPanel>
        <p>Right</p>
      </Layout.RightPanel>
    )
  }

  renderLoader(){
    if(this.ready()) return null;
    return <CenterLoader/>;
  }

  ready(){ return !!this.state.deployment; }
  type() { return this.props.match.params['type']; }
}

const InfraDebug = AuthenticatedComponent.compose(
  InfraDebugClass
);

export default InfraDebug;