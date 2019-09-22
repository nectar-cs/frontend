import React, {Fragment} from 'react'
import NetworkGraph from "./NetworkGraph";
import TestResults from "./TestResults";
import AuthenticatedComponent from "../../hocs/AuthenticatedComponent";

export const FROM_COUNT = 2;
export const TO_COUNT = 20;


class NetworkTestClass extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      iFrom: 0,
      iTo: 0,
      count: 0,
      isRunning: false
    };

    this.repeat = this.repeat.bind(this);
  }

  render(){
    return(
      <Fragment>
        <NetworkGraph
          iFrom={this.state.iFrom}
          iTo={this.state.iTo}
          count={this.state.count}
        />
        <TestResults count={this.state.count}/>
      </Fragment>
    )
  }

  componentDidMount(){
    setTimeout(this.repeat, 1000);
  }

  repeat(){
    this.setState(s => {
      let count = this.state.count;
      const iFrom = count % FROM_COUNT;
      const iTo = count % TO_COUNT;
      count = count + 1;
      return { ...s, iFrom, iTo, count }
    });
    setTimeout(this.repeat, 1500);
  }
}

const NetworkTest = AuthenticatedComponent.compose(
  NetworkTestClass
);

export default NetworkTest;