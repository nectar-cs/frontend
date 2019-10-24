import React from 'react'
import AuthenticatedComponent from "../../hocs/AuthenticatedComponent";
import ComingSoonSection from "../../widgets/ComingSoonSection/ComingSoonSection";

class NotFoundClass extends React.Component {
  render(){
    return <ComingSoonSection size='x-large'/>;
  }
}

const NotFound = AuthenticatedComponent.compose(
  NotFoundClass
);

export default NotFound;