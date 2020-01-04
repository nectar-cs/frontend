import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { LeftHeader, Text, TextOverLineSubtitle } from "nectar-cs-js-common";
import {Layout} from "nectar-cs-js-common";

export default class TerminalStep extends React.Component{

  render(){
    return(
      <Fragment>
        { this.renderHeader() }
        { this.renderSummary() }
        { this.renderTips() }
        { this.renderConsole() }
        { this.renderResources() }
      </Fragment>
    )
  }

  renderHeader(){
    const { node } = this.props;

    return(
      <LeftHeader
        graphicName='cake'
        title={`Conclusion: ${node.title()}`}
        subtitle='Root cause identified. Explanation and how-to-fix.'
        graphicType='icon'
      />
    )
  }

  renderSummary(){
    const { terminal } = this.props;
    if(!terminal) return null;

    return(
      <Fragment>
        <TextOverLineSubtitle text='Diagnosis & Next Steps'/>
        <Text.P raw>{terminal.summary}</Text.P>
      </Fragment>
    )
  }

  renderTips(){
    const { terminal } = this.props;
    if(!terminal) return null;

    const Points = () => terminal.tips.map(tip => (
      <li key={tip}><p>{tip}</p></li>
    ));

    return(
      <Fragment>
        <Text.P low={2.5}><b>Resolution Tips:</b></Text.P>
        <ul>
          <Points/>
        </ul>
      </Fragment>
    )
  }

  renderConsole(){
    const { terminal } = this.props;
    if(!terminal) return null;

    const Content = () => terminal.commands.map(s => (
      <Text.Code key={s}>{s}</Text.Code>
    ));

    return(
      <Fragment>
        <TextOverLineSubtitle text={'Handy Copy Pasta'}/>
        <Layout.BigCodeViewer>
          <Content/>
        </Layout.BigCodeViewer>
      </Fragment>
    )
  }

  renderResources(){
    const { terminal } = this.props;
    if(!terminal) return null;
    const Refs = () => terminal.resources.map(r => (
      <li key={r.name} >
        <a href={r.url} target='_blank' ><p>{r.name}</p></a>
      </li>
    ));
    return(
      <Fragment>
        <TextOverLineSubtitle text='Recommended Reading'/>
        <ul><Refs/></ul>
      </Fragment>
    )
  }

  static propTypes = {
    node: PropTypes.object.isRequired,
    terminal: PropTypes.shape({
      summary: PropTypes.string.isRequired,
      tips: PropTypes.arrayOf(PropTypes.string).isRequired,
      commands: PropTypes.PropTypes.arrayOf(PropTypes.string).isRequired,
      resources: PropTypes.PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
      })).isRequired
    })
  }
}
