import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentCard.sass'
import MiscUtils from '../../../utils/MiscUtils';
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";

export default class DeploymentCard extends React.Component {

  static propTypes = {
    deployment: PropTypes.shape({
      name: PropTypes.string.isRequired,
      pods: PropTypes.arrayOf({
        name: PropTypes.string.isRequired,
        state: PropTypes.oneOf(['Running', 'Failed', 'Pending', 'Unknown'])
      }).isRequired
    }).isRequired
  };

  render(){
    return(
      <div className={s.card}>
        { this.renderHeader() }
        { this.renderContentRows() }
        <div className={s.podStatusesBox}>
          { this.renderPodStatuses() }
        </div>
      </div>
    )
  }

  renderHeader(){
    const deployment = this.props.deployment;
    let frameworkImg = MiscUtils.frameworkImage('docker');
    return(
      <div className={s.header}>
        <img className={s.headerImage} src={frameworkImg} alt='Language'/>
        <a href={this.detailPath()}><p className={s.headerTitle}>{deployment.name}</p></a>
        <p className={s.headerSubtitle}>Not connected to Git</p>
      </div>
    )
  }

  renderContentRows(){
    return <table>
      <tbody>
        { <ContentRow name='Image' value={<p>Sup</p>} /> }
        { <ContentRow name='Image' value={<p>Sup</p>} /> }
      </tbody>
    </table>;
  }

  renderPodStatuses(){
    return this.props.deployment.pods.map((pod) => {
      const statusCol = `podStatus${pod.state || "Unknown"}`;
      return(
        <div className={`${s.podCircle} ${s[statusCol]}`} key={pod.name}/>
      )
    });
  }

  detailPath(){
    return makeRoute(
      ROUTES.deployments.show.path, {
        id: this.props.deployment.name,
        ns: this.props.deployment.namespace
      }
    )
  }
}

function ContentRow(props){
  return(
    <tr>
      <td><p>{props.name}</p></td>
      <td>{props.value}</td>
    </tr>
  )
}