import React from 'react';
import s from './DeploymentList.sass'
import TextOverLineTitle from '../../../widgets/TextOverLineTitle/TextOverLineTitle';

class DeploymentItem extends React.Component {

  static statusClass(isSelected, status){
    if(isSelected) {
      return { klass: s.status, label: 'reviewing' };
    } else {
      if(status === 'accepted')
        return { klass: s.statusAccepted, label: 'included'};
      else if(status === 'rejected')
        return { klass: s.statusRejected, label: 'ignored'};
      else
        return { klass: s.statusPending, label: 'review pending' };
    }
  }

  render(){
    const {isSelected, name, status} = this.props;
    const statusBundle = DeploymentItem.statusClass(isSelected, status);
    return(
      <tr className={isSelected ? s.focusedRow : s.row}>
        <td><input type="checkbox" name="vehicle1" value="Bike"/></td>
        <td><p>default</p></td>
        <td><p>{name}</p></td>
        <td><p className={statusBundle.klass}>{statusBundle.label}</p></td>
      </tr>
    )
  }

  static header(){
    return(
      <tr>
        <th><input type="checkbox" name="vehicle1" value="Bike"/></th>
        <th><p>Namespace</p></th>
        <th><p>Deployment</p></th>
        <th><p>Status</p></th>
      </tr>
    )
  }

}

export default class DeploymentList extends React.Component {
  render(){

    const text = "Nectar found the following deployments on your cluster. " +
      "For each one that you want to work with in Nectar, check the box" +
      " and add some metadata. ";

    return(
      <div className={s.deploymentList}>
        <TextOverLineTitle text='Kubernetes Deployments'/>
        <p>{text}</p>
        <table className={s.mainTable}>
          <tbody>
          { DeploymentItem.header() }
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
        />
      )
    });
  }
}