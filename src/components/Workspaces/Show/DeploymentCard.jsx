import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentCard.sass'
import MiscUtils from '../../../utils/MiscUtils';

export default class DeploymentCard extends React.Component {

  static propTypes = {
    deployment: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  };

  render(){
    const bundle = {
      name: this.props.deployment.name,
      framework: 'docker',
      description: "Unmatched app"
    };

    let frameworkImg = MiscUtils.frameworkImage(bundle.framework);

    return(
      <div className={s.card}>
        <div className={s.header}>
          <img className={s.headerImage} src={frameworkImg} alt='Language'/>
          <p className={s.headerTitle}>{bundle.name}</p>
          <p className={s.headerSubtitle}>{bundle.description}</p>
        </div>
      </div>
    )
  }
}