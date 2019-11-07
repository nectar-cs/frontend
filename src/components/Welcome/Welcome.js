import React from 'react'
import AuthenticatedComponent from "../../hocs/AuthenticatedComponent";

class WelcomeClass extends React.Component{
  render(){
    return <p>PLEASE</p>;
  }
}

const Welcome = AuthenticatedComponent.compose(
  WelcomeClass, true
);

export default Welcome;