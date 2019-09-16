import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentList.sass'
import TextOverLineTitle from '../../../widgets/TextOverLineTitle/TextOverLineTitle';

function ListHeader() {
  return(
    <tr>
      <th><p>Deployment</p></th>
      <th className={s.rightCol}><p>Found in Namespaces</p></th>
    </tr>
  )
}

function DeploymentItem(props) {
  const {isSelected} = props;

  const namespaces = props.namespaces.map(ns => (
    <p key={ns} className={s.nsTag}>{ns}</p>
  ));

  return(
    <tr className={isSelected ? s.focusedRow : s.row}>
      <td><p>{props.name}</p></td>
      <td className={s.rightCol}>{namespaces}</td>
    </tr>
  )
}

export default class DeploymentList extends React.Component {
  render(){

    const text = "This wizard lets your tie deployments to their related git and image repos. " +
      "This is optional, and can be changed later.";

    return(
      <div className={s.deploymentList}>
        <TextOverLineTitle text='Kubernetes Deployments'/>
        <p>{text}</p>
        <table className={s.mainTable}>
          <tbody>
          <ListHeader/>
          { this.renderList() }
          </tbody>
        </table>
      </div>
    )
  }

  renderList(){
    return this.props.deployments.map((deployment, i) => {
      return(
        <DeploymentItem
          key={i}
          index={i}
          {...deployment}
          isSelected={i === this.props.selectedIndex}
          notifyDeploymentSelected={this.props.notifyDeploymentSelected}
          notifyCheckChanged={this.props.notifyCheckChanged}
        />
      )
    });
  }

  static propTypes = {
    selectedIndex: PropTypes.number,
    notifyDeploymentSelected: PropTypes.func.isRequired
  }
}