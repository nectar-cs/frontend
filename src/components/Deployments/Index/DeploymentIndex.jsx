import React, {Fragment} from 'react';
import AuthenticatedComponent from '../../../hocs/AuthenticatedComponent';
import s from './DeploymentIndex.sass'
import { ROUTES as R } from './../../../containers/RoutesConsts'
import CenterAnnouncement from '../../../widgets/CenterAnnouncement/CenterAnnouncement';
import CenterCard from '../../../widgets/CenterCard/CenterCard';
import Backend from '../../../utils/Backend';
import CenterLoader from '../../../widgets/CenterLoader/CenterLoader';
import DeploymentCard from './DeploymentCard';
import MiscUtils from "../../../utils/MiscUtils";
import KubeHandler from "../../../utils/KubeHandler";

class DeploymentIndexClass extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      deployments: null,
      selectedIndex: 0,
      isEntered: false
    };
    this.onCardClicked = this.onCardClicked.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    KubeHandler.fetchJson('/api/deployments', (depsPayload) => {
      Backend.fetchJson('/microservices', (msPayload) => {
        const deployments = this.mergeLists(depsPayload['data'], msPayload['data']);
        this.setState((s) => ({...s, deployments: deployments}));
      });
    });
  }

  mergeLists(deployments, microservices){
    return deployments.map((dp) => {
      const microservice = microservices.find((ms) => (
        ms.deploymentName === dp.name
      ));
      return {...dp, microservice: microservice}
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
      <div
        className={s.list}
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
        ref={div => div && div.focus()}
      >
        { this.state.deployments.map((deployment, i) => (
          <DeploymentCard
            key={deployment.deployment_name}
            isSelected={this.state.selectedIndex === i}
            deployment={deployment}
            onClick={() => this.onCardClicked(i)}
            isEntered={this.state.selectedIndex === i && this.state.isEntered}
          />
          ))
        }
      </div>
    );
  }

  onCardClicked(index){
    this.setState((s) => ({...s, selectedIndex: index}));
  }

  handleKeyDown(e) {
    const crtIndex = this.state.selectedIndex;
    const listMax = this.state.deployments.length;
    let nextIndex = this.state.selectedIndex;
    let isEntered = null;

    if (e.keyCode === 37)
      nextIndex = MiscUtils.positiveMod(crtIndex - 1, listMax);
    else if (e.keyCode === 39)
      nextIndex = (crtIndex + 1) % listMax;
    else if(e.keyCode === 13)
      isEntered = !this.state.isEntered;

    if(nextIndex != null)
      this.setState((s) => ({...s, selectedIndex: nextIndex, isEntered}));

    if(isEntered != null)
      this.setState((s) => ({...s, isEntered}));
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