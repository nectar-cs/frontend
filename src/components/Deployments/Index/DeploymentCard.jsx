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
    isSelected: PropTypes.bool,
    isEntered: PropTypes.bool,
    onClick: PropTypes.func
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
    let outterClass = this.props.isSelected ? s.cardFocused : s.card;
    outterClass = this.props.isEntered ? s.cardEntered : outterClass;

    return(
      <div className={outterClass} onClick={this.props.onClick}>
        <div className={s.header}>
          <img className={s.headerImage} src={frameworkImg} alt='Language'/>
          <p className={s.headerTitle}>{bundle.name}</p>
          <p className={s.headerSubtitle}>{bundle.description}</p>
        </div>
      </div>
    )
  }
}