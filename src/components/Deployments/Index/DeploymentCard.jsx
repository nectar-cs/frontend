import React from 'react';
import PropTypes from 'prop-types'
import s from './DeploymentCard.sass'
import MiscUtils from '../../../utils/MiscUtils';


export default class DeploymentCard extends React.Component {

  static propTypes = {
    deployment: {
      name: PropTypes.string,
      microservice: {
        name: PropTypes.string,
        description: PropTypes.string,
        framework: PropTypes.string
      }
    },
    isSelected: PropTypes.bool
  };

  render(){
    let bundle = this.props.deployment.microservice;
    if(!bundle){
      bundle = {
        name: this.props.deployment.name,
        framework: 'docker',
        description: "Unmatched app"
      }
    }

    let frameworkImg = MiscUtils.frameworkImage(bundle.framework);
    const outterClass = this.props.isSelected ? s.cardFocused : s.card;

    return(
      <div className={outterClass}>
        <div className={s.header}>
          <img className={s.headerImage} src={frameworkImg} alt='Language'/>
          <p className={s.headerTitle}>{bundle.name}</p>
          <p className={s.headerSubtitle}>{bundle.description}</p>
        </div>
      </div>
    )
  }
}