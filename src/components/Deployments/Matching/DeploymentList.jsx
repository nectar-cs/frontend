import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentList.sass'
import TextOverLineTitle from '../../../widgets/TextOverLineTitle/TextOverLineTitle';
import {Icon} from "../../../modals/ImageActionsModal/ChecklistStyles";

function ListHeader() {
  return(
    <tr>
      <th><p>Deployment</p></th>
      <th><p>Found in Namespaces</p></th>
      <th><p className={s.checkHead}>Git</p></th>
      <th><p className={s.checkHead}>Docker</p></th>
    </tr>
  )
}

function DeploymentItem(props) {
  const {isSelected} = props;

  const namespaces = props.namespaces.map(ns => (
    <p key={ns} className={s.nsTag}>{ns}</p>
  ));

  const icon = (name) => {
    if(props.isReviewed){
      const bun = props.ms;
      const material = bun && bun[name] ? 'check' : 'close';
      const emotion = bun && bun[name] ? 'success' : 'idle';
      return <Icon className='material-icons' emotion={emotion}>{material}</Icon>
    } else return null;
  };

  return(
    <tr className={isSelected ? s.focusedRow : s.row}>
      <td><p>{props.name}</p></td>
      <td>{namespaces}</td>
      <td>{icon('gitRepoName')}</td>
      <td>{icon('imgRepoName')}</td>
    </tr>
  )
}

DeploymentItem.propTypes = {
  gitDone: PropTypes.bool,
  dockerDone: PropTypes.bool,
  namespaces: PropTypes.arrayOf(PropTypes.string).isRequired,
  isSelected: PropTypes.bool
};

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
        />
      )
    });
  }

  static propTypes = {
    selectedIndex: PropTypes.number,
    notifyDeploymentSelected: PropTypes.func.isRequired
  }
}