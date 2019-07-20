import React from 'react';
import s from './DeploymentCard.sass'
import ts from './../../../assets/text-combos.sass'
import ReactSVG from 'react-svg';
import MiscUtils from '../../../utils/MiscUtils';
import DivOverLine from '../../../widgets/DivOverLine/DivOverLine';
import { NavLink } from 'react-router-dom';
import { makeRoute, ROUTES, SUBS } from '../../../containers/RoutesConsts';
import DataUtils from '../../../utils/DataUtils';

const Cell = (props) => <td className={s.environmentRow}>{props.children}</td>;

class EnvironmentHeader extends React.Component{
  render(){
    return(
      <tr className={s.headerRow}>
        <Cell><p className={s.fidelityCellText}>Environment</p></Cell>
        <Cell><p className={s.fidelityCellText}>APE</p></Cell>
        <Cell><p className={s.fidelityCellText}>Real</p></Cell>
      </tr>
    )
  }
}

class EnvironmentRow extends React.Component{
  render(){
    return(
     <tr>
       <Cell><p>{this.props.environment}</p></Cell>
       <Cell>{EnvironmentRow.fidelityCell()}</Cell>
       <Cell>{EnvironmentRow.fidelityCell()}</Cell>
     </tr>
    )
  }

  static fidelityCell(){
    let k, i;
    k = ts.fontColorSuccess;
    i = 'done';
    return <i className={`${k} ${s.outcomeIcon} material-icons`}>{i}</i>
  }
}

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