import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import LeftHeader from '../../widgets/LeftHeader/LeftHeader';
import defaults from './defaults';
import CenterAnnouncement from '../../widgets/CenterAnnouncement/CenterAnnouncement';
import Text from '../../assets/text-combos';
import Loader from '../../assets/loading-spinner';
import TextOverLineSubtitle from '../../widgets/TextOverLineSubtitle/TextOverLineSubtitle';
import Layout from '../../assets/layouts';
import S from './StepExecutionStyles';
import Helper from './Helper';
import ModalButton from '../../widgets/Buttons/ModalButton';

export default class DebugStep extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        {this.renderHeader()}
        {this.renderNotReady()}
        {this.renderExplanation()}
        {this.renderConsole()}
        {this.renderAnalysis()}
        {this.renderMainButton()}
      </Fragment>
    );
  }

  renderHeader() {
    const { node, isConfigDone } = this.props;
    if (!isConfigDone) return null;

    return (
      <LeftHeader
        graphicName="bug_report"
        title={defaults.step.title(node.depth() + 1, node.title())}
        subtitle={defaults.step.subtitle}
        graphicType="icon"
      />
    );
  }

  renderNotReady() {
    if (this.props.isConfigDone) return null;

    return (
      <CenterAnnouncement iconName="pause_circle_outline" contentType="children">
        <Text.P>{defaults.step.notReady}</Text.P>
      </CenterAnnouncement>
    );
  }

  renderConsole() {
    const { step, isConfigDone } = this.props;
    if (!isConfigDone || !step) return null;

    const copy = defaults.step.progress;
    const Content = () => this.terminalOutput().map(s => <Text.Code key={s}>{s}</Text.Code>);

    return (
      <Fragment>
        <TextOverLineSubtitle text={copy.title} />
        <Layout.BigCodeViewer>
          <Content />
        </Layout.BigCodeViewer>
      </Fragment>
    );
  }

  renderExplanation() {
    const { step, isConfigDone } = this.props;
    if (!isConfigDone || !step) return null;

    const copy = defaults.step.explanation;
    const { summary, subSteps } = this.props.step;
    const Points = () =>
      subSteps.map(exp => (
        <li key={exp}>
          <p>{exp}</p>
        </li>
      ));
    return (
      <Fragment>
        <TextOverLineSubtitle text={copy.title} />
        <p>{summary}</p>
        <Text.P low={2.5}>
          <b>{copy.subtitle}</b>
        </Text.P>
        <S.Explanation>
          <Points />
        </S.Explanation>
      </Fragment>
    );
  }

  renderAnalysis() {
    if (!this.hasFinished()) return null;
    const verdict = this.props.step.result;

    const Points = () =>
      this.analysis().map(exp => (
        <li key={exp}>
          <p>{exp}</p>
        </li>
      ));

    return (
      <Fragment>
        <TextOverLineSubtitle text={defaults.step.analysis.title} />
        <S.VerdictLine>
          <Text.BoldStatus>VERDICT:</Text.BoldStatus>
          <Text.BoldStatus pushed emotion={Helper.verdictEmotion(verdict)}>
            {Helper.verdictString(verdict)}
          </Text.BoldStatus>
        </S.VerdictLine>
        <S.Conclusion>
          <Points />
        </S.Conclusion>
      </Fragment>
    );
  }

  renderMainButton() {
    const { isConfigDone, hasStarted, step } = this.props;
    if (!isConfigDone || !step) return null;

    const { runStepCallback, nextStepCallback } = this.props;
    const done = this.hasFinished();
    const callback = done ? nextStepCallback : runStepCallback;
    const text = this.generalConfig()[done ? 'nextCheck' : 'runCheck'];

    return <ModalButton callback={callback} title={text} isEnabled={!hasStarted} />;
  }

  hasFinished() {
    const { step } = this.props;
    return step && !!step.result;
  }

  terminalOutput() {
    const { commands, outputs } = this.props.step;
    if (!commands) return [];
    if (!outputs) return commands;
    return [...commands, '\n---\n', ...outputs];
  }

  analysis() {
    const { step } = this.props;
    return step ? step.outcomes : [];
  }

  key() {
    const key = this.constructor.name;
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  generalConfig() {
    return defaults.step;
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    node: PropTypes.object,
    hasStarted: PropTypes.bool.isRequired,
    runStepCallback: PropTypes.func.isRequired,
    nextStepCallback: PropTypes.func.isRequired,
    step: PropTypes.shape({
      result: PropTypes.oneOf(['positive', 'negative']),
      summary: PropTypes.string.isRequired,
      subSteps: PropTypes.arrayOf(PropTypes.string).isRequired,
      commands: PropTypes.arrayOf(PropTypes.string).isRequired,
      outcomes: PropTypes.arrayOf(PropTypes.string),
    }),
  };
}
