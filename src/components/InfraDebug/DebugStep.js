import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import defaults from './defaults'
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import Text from "../../assets/text-combos";
import Loader from "../../assets/loading-spinner";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import Layout from "../../assets/layouts";
import S from "./StepExecutionStyles";
import Helper from "./Helper";

export default class DebugStep extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasStarted: false
    }
  }


  render(){
    return(
      <Fragment>
        { this.renderTopLoader() }
        { this.renderHeader() }
        { this.renderNotReady() }
        { this.renderExplanation() }
      </Fragment>
    )
  }

  renderHeader(){
    const { node, isConfigDone } = this.props;
    if(!isConfigDone) return null;

    return(
      <LeftHeader
        graphicName='bug_report'
        title={defaults.step.title(node.depth() + 1, node.title())}
        subtitle={defaults.step.subtitle}
        graphicType='icon'
      />
    )
  }

  renderTopLoader(){
    if(!!this.props.step) return;
    return <Loader.TopRightSpinner/>;
  }

  renderNotReady(){
    if(this.props.isConfigDone) return null;

    return(
      <CenterAnnouncement
        iconName='pause_circle_outline'
        contentType='children'>
        <Text.P>{defaults.step.notReady}</Text.P>
      </CenterAnnouncement>
    )
  }

  renderConsole(){
    if(!this.props.step) return null;

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
    if(!this.props.step) return null;

    const copy = defaults.step.explanation;
    const { summary, subSteps } = this.props.step;
    const Points = () => subSteps.map(exp => (
      <li key={exp}><p>{exp}</p></li>
    ));
    return(
      <Fragment>
        <TextOverLineSubtitle text={copy.title} />
        <p>{summary}</p>
        <Text.P low={2.5}><b>{copy.subtitle}</b></Text.P>
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
    type: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired,
    step: PropTypes.shape({
      summary: PropTypes.string.isRequired,
      subSteps: PropTypes.arrayOf(PropTypes.string).isRequired,
      commands: PropTypes.arrayOf(PropTypes.string).isRequired
    }),
    nextStepCallback: PropTypes.func.isRequired
  }
}