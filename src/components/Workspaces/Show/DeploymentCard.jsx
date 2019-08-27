import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentCard.sass'
import MiscUtils from '../../../utils/MiscUtils';
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";

export default class DeploymentCard extends React.Component {

  static propTypes = {
    deployment: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  };

  render(){
    const deployment = this.props.deployment;
    let frameworkImg = MiscUtils.frameworkImage('docker');

    const showCardPath = makeRoute(
      ROUTES.deployments.show.path, {
        id: deployment.name,
        ns: deployment.namespace
      }
    );

    return(
      <div className={s.card}>
        <div className={s.header}>
          <img className={s.headerImage} src={frameworkImg} alt='Language'/>
          <a href={showCardPath}><p className={s.headerTitle}>{deployment.name}</p></a>
          <p className={s.headerSubtitle}>Not connected to Git</p>
        </div>
        <div className={s.podStatusesBox}>
          { this.renderPodStatuses() }
        </div>
      </div>
    )
  }

  renderPodStatuses(){
    const states = ['ready', 'pending', 'failed'];
    return states.map((pod) => {
      return(
        <div className={s.podCircle} key={pod}>
        </div>
      )
    });
  }
}