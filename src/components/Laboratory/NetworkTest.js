import React, {Fragment} from 'react'
import NetworkGraph from "./NetworkGraph";
import TestResults from "./TestResults";
import AuthenticatedComponent from "../../hocs/AuthenticatedComponent";

class NetworkTestClass extends React.Component {
  render(){
    return(
      <Fragment>
        <NetworkGraph/>
        <TestResults/>
      </Fragment>
    )
  }
}

const NetworkTest = AuthenticatedComponent.compose(
  NetworkTestClass
);

export default NetworkTest;