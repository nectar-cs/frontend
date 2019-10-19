import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import defaults from './defaults'
import S from './StepExecutionStyles'
import Layout from "../../assets/layouts";
import Text from './../../assets/text-combos'
import Helper from "./Helper";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";

export default class StepExecution extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasStarted: false
    }
  }

  render(){
    return(
      <Fragment>
        { this.renderExplanation() }
        { this.renderConsole() }
        { this.renderVerdict() }
        { this.renderNextStepText() }
        { this.renderStartButton() }
      </Fragment>
    )
  }

  renderConsole(){
    const copy = defaults.step.progress;
    const Content = () => this.terminalOutput().map(s => (
      <Text.Code key={s}>{s}</Text.Code>
    ));

    return(
      <Fragment>
        <TextOverLineSubtitle text={copy.title}/>
        <Layout.BigCodeViewer>
          <Content/>
        </Layout.BigCodeViewer>
      </Fragment>
    )
  }

  renderExplanation(){
    const copy = defaults.step.explanation;
    const Points = () => ["Have fun!"].map(exp => (
      <li key={exp}><p>{exp}</p></li>
    ));
    return(
      <Fragment>
        <TextOverLineSubtitle text={copy.title} />
        <Text.P><b>{copy.subtitle}</b></Text.P>
        <S.Explanation>
          <Points/>
        </S.Explanation>
      </Fragment>
    )
  }

  renderVerdict(){
    const verdict = false;
    const copy = defaults.step.verdict;

    return(
      <Fragment>
        <TextOverLineSubtitle text={copy.title} />
        <S.VerdictLine>
          <Text.BoldStatus>VERDICT:</Text.BoldStatus>
          <Text.BoldStatus
            pushed={true}
            emotion={Helper.verdictEmotion(verdict)}>
            { Helper.verdictString(verdict) }
          </Text.BoldStatus>
        </S.VerdictLine>
      </Fragment>
    )
  }

  renderAnalysis() {
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
    if(!this.props.isActive) return null;
    if(this.state.hasStarted) return null;

    return(
      <S.StartButton onClick={this.props.nextStepCallback}>
        { this.genConfig().runCheck }
      </S.StartButton>
    )
  }

  terminalOutput(){
    return ["console.log('nada');"];
  }

  key(){
    const key = this.constructor.name;
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  analysis(){ return ["This is broken", "So is that"]; }
  genConfig() { return defaults.step }

  static propTypes = {
    nextStepCallback: PropTypes.func.isRequired,
  }
}