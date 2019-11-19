import React from 'react'
import AuthenticatedComponent from "../../hocs/AuthenticatedComponent";
import ComingSoonSection from "../../widgets/ComingSoonSection/ComingSoonSection";
import upcoming from "../../containers/upcoming";
import FutureFeature from "../../widgets/FutureFeature/FutureFeature";
import DataUtils from "../../utils/DataUtils";

class NotFoundClass extends React.Component {

  render(){
    let path = this.props.location.pathname;
    path = path.replace("/", "").replace("-", "_");
    path = DataUtils.snakeStringToCamel(path);

    if(upcoming[path]){
      return <FutureFeature upcomingKey={path}/>
    } else {
      return <ComingSoonSection size='x-large'/>;
    }
  }
}

const NotFound = AuthenticatedComponent.compose(
  NotFoundClass
);

export default NotFound;