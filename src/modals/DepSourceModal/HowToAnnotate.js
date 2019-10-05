import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import S from './HowToAnnotateStyles'
import defaults from "./defaults";
import { Layout } from './../../assets/layouts'
import Text from './../../assets/text-combos'
import {Types} from "../../types/Deployment";

export default class HowToAnnotate extends React.Component {
  render(){
    return(
      <Fragment>
        <S.Title>{defaults.howTo.title}</S.Title>
        { this.renderLines(defaults.howTo.lines) }
        <S.Title>{defaults.howTo.title2}</S.Title>
        { this.renderLines(defaults.howTo.lines2) }
        { this.renderCodeExample() }
        <S.Title>{defaults.howTo.title3}</S.Title>
        { this.renderLines(defaults.howTo.lines3) }
      </Fragment>
    )
  }

  renderLines(lines){
    return lines.map(line =>
      <Text.P>{line}</Text.P>
    );
  }

  renderCodeExample(){
    const { name, namespace } = this.props.deployment;
    const commands = defaults.howTo.commands(name, namespace);
    const cmdViews = commands.map(command =>
      <Text.Code key={command}>{command}</Text.Code>
    );

    return(
      <Layout.BigCodeViewer>
        { cmdViews }
      </Layout.BigCodeViewer>
    )
  }

  static propTypes = {
    deployment: Types.Deployment
  }
}