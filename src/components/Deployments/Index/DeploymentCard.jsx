import React from 'react';
import s from './DeploymentCard.sass'
import MiscUtils from '../../../utils/MiscUtils';


export default class DeploymentCard extends React.Component {
  render(){
    const { name, description, framework } = this.props.deployment;
    let frameworkImg = MiscUtils.frameworkImage(framework);

    return(
      <div className={s.card}>
        <div className={s.header}>
          <img className={s.headerImage} src={frameworkImg}/>
          <p className={s.headerTitle}>{name}</p>
          <p className={s.headerSubtitle}>{description}</p>
        </div>
      </div>
    )
  }
}