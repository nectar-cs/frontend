import React, { Fragment } from 'react';
import FormComponent from '../../hocs/FormComponent';
import Utils from '../../utils/Utils';

class LogsFormClass extends React.Component<Props> {
  render() {
    return (
      <Fragment>
        {this.renderPodSelector()}
        {this.renderSinceLine()}
      </Fragment>
    );
  }

  renderPodSelector() {
    const { podNameChoices } = this.props;
    return this.props.makeSelect('Pod', 'podName', Utils.arrayOptions(podNameChoices));
  }

  renderMinutesItem() {
    return this.props.makeSelectItem('sinceMinutes', LogsFormClass.MINUTES_OPTIONS);
  }

  renderSecondsItem() {
    return this.props.makeSelectItem('sinceSeconds', LogsFormClass.SECONDS_OPTIONS);
  }

  renderSinceLine() {
    return this.props.makeLine('Since', [
      () => this.renderMinutesItem(),
      () => this.renderSecondsItem(),
    ]);
  }

  static timeOptions(unit) {
    return [...Array(60).keys()].map(i => ({ value: `${i}`, show: `${i} ${unit}` }));
  }

  static MINUTES_OPTIONS = Utils.arrayOfHashesOptions(LogsFormClass.timeOptions('Minutes'));

  static SECONDS_OPTIONS = Utils.arrayOfHashesOptions(LogsFormClass.timeOptions('Seconds'));
}

type Props = {
  selectedPodName: ?string,
  podName: string[],
  sinceMinutes: string,
  sinceSeconds: string,
};

const LogsForm = FormComponent.compose(LogsFormClass);

export default LogsForm;
