import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentList.sass'
import TextOverLineTitle from '../../../widgets/TextOverLineTitle/TextOverLineTitle';

class DeploymentItem extends React.Component {

  static propTypes = {
    notifyCheckChanged: PropTypes.func.isRequired
  };

  constructor(props){
    super(props);
    this.checkRef = React.createRef();
  }

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
    const {isSelected, name, status, isChecked} = this.props;
    const callback = () => {
      this.props.notifyCheckChanged(name, this.checkRef.current.value);
    };

    const statusBundle = DeploymentItem.statusClass(isSelected, status);
    return(
      <tr className={isSelected ? s.focusedRow : s.row}>
        <td>
          <input
            type="checkbox"
            ref={this.checkRef}
            checked={isChecked}
            onChange={callback}/>
        </td>
        <td><p>default</p></td>
        <td><p>{name}</p></td>
        <td><p className={statusBundle.klass}>{statusBundle.label}</p></td>
      </tr>
    )
  }
}

class ListHeader extends React.Component {
  constructor(props){
    super(props);
    this.checkedRef = React.createRef();
  }

  render(){
    const callback = () => {
      this.props.notifyCheckAllChanged(this.checkedRef.current.checked);
    };

    return(
      <tr>
        <th>
          <input
            type="checkbox"
            ref={this.checkedRef}
            defaultChecked={true}
            onChange={callback}/>
        </th>
        <th><p>Namespace</p></th>
        <th><p>Deployment</p></th>
        <th><p>Status</p></th>
      </tr>
    )
  }

  static propTypes = {
    notifyCheckAllChanged: PropTypes.func.isRequired
  };
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
          <ListHeader
            notifyCheckAllChanged={this.props.notifyCheckAllChanged}
          />
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
          notifyCheckChanged={this.props.notifyCheckChanged}
        />
      )
    });
  }

  static propTypes = {
    notifyCheckChanged: PropTypes.func.isRequired,
    notifyCheckAllChanged: PropTypes.func.isRequired
  }
}