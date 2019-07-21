import React from 'react';
import AuthenticatedComponent from '../../../hocs/AuthenticatedComponent';
import s from './DeploymentIndex.sass'
import { ROUTES as R } from './../../../containers/RoutesConsts'
import CenterAnnouncement from '../../../widgets/CenterAnnouncement/CenterAnnouncement';
import CenterCard from '../../../widgets/CenterCard/CenterCard';
import Backend from '../../../utils/Backend';
import CenterLoader from '../../../widgets/CenterLoader/CenterLoader';
import DeploymentCard from './DeploymentCard';
import MiscUtils from "../../../utils/MiscUtils";

class DeploymentIndexClass extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      deployments: null,
      selectedIndex: 0
    };
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount() {
    Backend.fetchJson('/microservices', (payload) => {
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
      <div className={s.list} onKeyDown={this.handleKeyDown} tabIndex={0}>
        { this.state.deployments.map((deployment, i) => (
            <DeploymentCard
              key={deployment.deployment_name}
              isSelected={this.state.selectedIndex === i}
              deployment={deployment}
            />
          ))
        }
      </div>
    );
  }

  handleKeyDown(e) {
    const crtIndex = this.state.selectedIndex;
    const listMax = this.state.deployments.length;
    let nextIndex = null;

    if (e.keyCode === 37)
      nextIndex = MiscUtils.positiveMod(crtIndex - 1, listMax);
    else if (e.keyCode === 39)
      nextIndex = (crtIndex + 1) % listMax;
    else nextIndex = -1;

    console.log("KEY DOWN " + e.keyCode);
    if(nextIndex != null){
      console.log("KEY DOWN " + e.keyCode + " IND " + nextIndex );
      this.setState((s) => ({...s, selectedIndex: nextIndex}));
    }
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