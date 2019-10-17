import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../hocs/AuthenticatedComponent";
import Layout from "../../assets/layouts";
import OverviewSide from "./OverviewSide";

class InfraDebugClass extends React.Component {
  render(){
    return(
      <Fragment>
        { this.renderOverviewSide() }
        { this.renderActionSide() }
      </Fragment>
    )
  }

  renderOverviewSide(){
    return(
      <Layout.LeftPanel>
        <OverviewSide/>
      </Layout.LeftPanel>
    )
  }

  renderActionSide(){
    return(
      <Layout.RightPanel>
        <p>Right</p>
      </Layout.RightPanel>
    )
  }
}

const InfraDebug = AuthenticatedComponent.compose(
  InfraDebugClass
);

export default InfraDebug;