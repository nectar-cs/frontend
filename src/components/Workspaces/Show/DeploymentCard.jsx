import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentCard.sass'
import MiscUtils from '../../../utils/MiscUtils';
import {makeRoute, ROUTES} from "../../../containers/RoutesConsts";
import HttpActionsModal from "../../../modals/HttpActionsModal/HttpActionsModal";

export default class DeploymentCard extends React.Component {

  static propTypes = {
    openModal: PropTypes.func.isRequired,
    deployment: PropTypes.shape({
      name: PropTypes.string.isRequired,
      imageName: PropTypes.string.isRequired,
      pods: PropTypes.arrayOf({
        name: PropTypes.string.isRequired,
        state: PropTypes.oneOf(['Running', 'Failed', 'Pending', 'Unknown'])
      }).isRequired,
      services: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          fromPort: PropTypes.number.isRequired,
          toPort: PropTypes.number.isRequired,
          internalIp: PropTypes.string,
          externalIp: PropTypes.string,
          shortDns: PropTypes.string.isRequired,
          longDns: PropTypes.string.isRequired
        })
      )
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
    const dep = this.props.deployment;
    const svc = this.props.deployment.services[0];

    const ipLabel = `Internal${svc.externalIp ? ', External' : ''} IP`;
    const ipText = `${svc.internalIp}${svc.externalIp ? `, ${svc.externalIp}` : ''}`;

    return <table className={s.contentRows}>
      <tbody>
        { <ContentRow name='Image' text={dep.imageName} /> }
        { <ContentRow name='Ports' text={`${svc.toPort} <- ${svc.fromPort}`} />}
        { <ContentRow name='DNS' value={this.httpActionRow(`${svc.shortDns}`)} />}
        { <ContentRow name={ipLabel} text={ipText} />}
      </tbody>
    </table>;
  }

  httpActionRow(text){
    const action = () => this.httpModalAction(text);
    return(
      <p className={s.rowTextClickable} onClick={action}>
        { text }
      </p>
    )
  }

  httpModalAction(url){
    const bundle = {
      deployment: this.props.deployment,
      targetAddr: url
    };
    this.props.openModal(HttpActionsModal, bundle);
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
  let value = props.text;
  value = value ? <p className={s.rowText}>{value}</p> : props.value;
  return(
    <tr>
      <td>
        <p className={s.rowText}>{
          props.name}
        </p>
      </td>
      <td className={s.contentRow}>{value}</td>
    </tr>
  )
}