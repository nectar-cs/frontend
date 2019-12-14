import React from 'react';
import upcoming from '../../containers/upcoming';
import AuthenticatedComponent from '../../hocs/AuthenticatedComponent';
import DataUtils from '../../utils/DataUtils';
import ComingSoonSection from '../../widgets/ComingSoonSection/ComingSoonSection';
import FutureFeature from '../../widgets/FutureFeature/FutureFeature';

class NotFoundClass extends React.Component {
  render() {
    let path = this.props.location.pathname;
    path = path.replace('/', '').replace('-', '_');
    path = DataUtils.snakeStringToCamel(path);

    if (upcoming[path]) {
      return <FutureFeature upcomingKey={path} />;
    }
    return <ComingSoonSection size="x-large" />;
  }
}

const NotFound = AuthenticatedComponent.compose(NotFoundClass);

export default NotFound;
