import React, {Fragment} from 'react'
import defaults from './defaults'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import S from './CheckStepStyles'
import Layout from "../../assets/layouts";
import Text from './../../assets/text-combos'
import Helper from "./Helper";

export default class CheckStep extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasStarted: false
    }
  }

  render(){
    return(
      <Fragment>
        { this.renderTitle() }
        { this.renderExplanation() }
        { this.renderConsole() }
        { this.renderVerdict() }
        { this.renderAnalysis() }
        { this.renderNextStepText() }
        { this.renderStartButton() }
      </Fragment>
    )
  }

  renderTitle(){
    return <TextOverLineSubtitle text={this.config().title}/>;
  }

  renderConsole(){
    const {hasStarted} = this.state;
    const strings = hasStarted ? this.terminalOutput() :
      [this.genConfig().consolePrompt];

    const Content = () => strings.map(s => (
      <Text.Code key={s}>{s}</Text.Code>
    ));

    return(
      <Layout.BigCodeViewer>
        <Content/>
      </Layout.BigCodeViewer>
    )
  }

  renderExplanation(){
    const Points = () => this.config().explanation.map(exp => (
      <li key={exp}><p>{exp}</p></li>
    ));
    return(
      <Fragment>
        <Text.P>Game Plan:</Text.P>
        <S.Explanation>
          <Points/>
        </S.Explanation>
      </Fragment>
    )
  }

  renderVerdict(){
    if(!this.state.hasStarted) return null;
    const verdict = false;

    return(
      <S.VerdictLine>
        <Text.BoldStatus>VERDICT:</Text.BoldStatus>
        <Text.BoldStatus
          pushed={true}
          emotion={Helper.verdictEmotion(verdict)}>
          { Helper.verdictString(verdict) }
        </Text.BoldStatus>
      </S.VerdictLine>
    )
  }

  renderAnalysis() {
    if(!this.state.hasStarted) return null;

    const Points = () => this.analysis().map(exp => (
      <li key={exp}><p>{exp}</p></li>
    ));
    return <S.Explanation><Points/></S.Explanation>;
  }

  renderNextStepText() {
    if(!this.state.hasStarted) return null;

    const verdict = true;
    if (!verdict) return null;
    return(
      <Fragment>
        <S.NextButton>Run Next Check</S.NextButton>
      </Fragment>
    )
  }

  renderStartButton(){
    return(
      <S.StartButton>
        { this.genConfig().runCheck }
      </S.StartButton>
    )
  }

  terminalOutput(){
    return "console.log('nada');"
  }

  key(){
    const key = this.constructor.name;
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  analysis(){ return ["This is broken", "So is that"]; }
  config() { return defaults[this.key()] }
  genConfig() { return defaults.general }
}