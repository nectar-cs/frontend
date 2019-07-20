import React from 'react';
import AuthenticatedComponent from '../../../hocs/AuthenticatedComponent';
import s from './DeploymentIndex.sass'
import { ROUTES as R } from './../../../containers/RoutesConsts'
import CenterAnnouncement from '../../../widgets/CenterAnnouncement/CenterAnnouncement';
import CenterCard from '../../../widgets/CenterCard/CenterCard';
import WebUtils from '../../../utils/WebUtils';
import CenterLoader from '../../../widgets/CenterLoader/CenterLoader';
import DeploymentCard from './DeploymentCard';

class DeploymentIndexClass extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      deployments: null
    }
  }

  componentDidMount() {
    WebUtils.fetchJson('/microservices', (payload) => {
      this.setState((s) => ({...s, deployments: payload['data']}));
    });
  }

  render(){
    const items = this.state.deployments;
    if(items){
      if(items.length > 0)
        return this.renderCards();
      else
        return DeploymentIndexClass.renderEmptyList();
    } else return <CenterLoader/>;
  }

  renderCards(){
    return(
      <div className={s.list}>
        { this.state.deployments.map((sysObject) => (
            <DeploymentCard
              key={sysObject.name}
              deployment={sysObject}
            />
          ))
        }
      </div>
    );
  }

  static renderEmptyList(){
    return(
      <CenterCard>
        <CenterAnnouncement
          contentType='nav-link'
          text='Your system is empty. Click sync.'
          iconName='search'
          routeTo={R.deployments.detect}
        />
      </CenterCard>
    )
  }
}

const DeploymentIndex = AuthenticatedComponent.compose(
  DeploymentIndexClass
);

export { DeploymentIndex as default };