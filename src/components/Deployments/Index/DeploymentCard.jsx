import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentCard.sass'
import MiscUtils from '../../../utils/MiscUtils';


export default class DeploymentCard extends React.Component {

  static propTypes = {
    deployment: {
      name: PropTypes.string,
      description: PropTypes.string,
      framework: PropTypes.string
    },
    isSelected: PropTypes.bool
  };

  render(){
    const { name, description, framework } = this.props.deployment;
    let frameworkImg = MiscUtils.frameworkImage(framework);
    const outterClass = this.props.isSelected ? s.cardFocused : s.card;

    return(
      <div className={outterClass}>
        <div className={s.header}>
          <img className={s.headerImage} src={frameworkImg} alt='Language'/>
          <p className={s.headerTitle}>{name}</p>
          <p className={s.headerSubtitle}>{description}</p>
        </div>
      </div>
    )
  }
}