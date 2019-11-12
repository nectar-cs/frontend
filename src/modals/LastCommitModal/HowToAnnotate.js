import React, {Fragment} from 'react'
import defaults from "./defaults";
import Layout from './../../assets/layouts'
import Text from './../../assets/text-combos'
import {Types} from "../../types/CommonTypes";
import Utils from "../../utils/Utils";

export default class HowToAnnotate extends React.Component {
  render(){
    return(
      <Fragment>
        <h4>{defaults.howTo.title}</h4>
        { this.renderLines(defaults.howTo.lines) }
        <h4>{defaults.howTo.title2}</h4>
        { this.renderLines(defaults.howTo.lines2) }
        { this.renderCodeExample() }
        <h4>{defaults.howTo.title3}</h4>
        { this.renderLines(defaults.howTo.lines3) }
      </Fragment>
    )
  }

  componentDidMount(){
    Utils.mp("Last Commit Start", {bound: false});
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