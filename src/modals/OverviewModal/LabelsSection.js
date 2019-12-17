//@flow
import type {Deployment, LabelMatrix} from "../../types/Types";
import React, {Fragment} from "react";
import Helper from "./Helper";
import Micon from "../../widgets/Micon/Micon";
import S from './Styles'
import defaults from "./defaults";
import {Text, Tables, Loader} from "ui-common/api/styles";

export default class LabelsSection extends React.Component<Props, State>{

  constructor(props) {
    super(props);
    this.state = defaultState(props);
  }

  async componentDidMount(): * {
    const { deployment } = this.props;
    this.setState(s => ({...s, isFetching: true}));
    const labelChecks = await Helper.fetchLabelChecks(deployment);
    this.setState(s => ({...s, labelChecks, isFetching: false}));
  }

  render(){
    return(
      <Fragment>
        { this.renderTopLoader() }
        { this.renderDiffTables() }
        { this.renderLabelChecks() }
      </Fragment>
    )
  }

  renderTopLoader(){
    if(!this.state.isFetching) return null;
    return <Loader.TopRightSpinner/>;
  }

  renderLabelChecks(){
    const { labelChecks } = this.state;
    if(!labelChecks) return null;

    const CheckRows = () => Object.keys(labelChecks).map(checkKey => (
      <LabelCheckRow
        key={checkKey}
        checkName={checkKey}
        outcome={labelChecks[checkKey]}
      />
    ));
    return(
      <Tables.Table low={1.4}>
        <tbody>
        <CheckRows/>
        </tbody>
      </Tables.Table>
    )
  }

  renderDiffTables(){
    const { labels, templateLabels, selectorLabels } = this.props.deployment;
    return(
      <Fragment>
        <Text.P low={-0.75}>A deployment defines <b>three sets</b> of labels:</Text.P>
        <S.Editors>
          { this.renderNanoLabels('labels', labels) }
          { this.renderNanoLabels('selectors', selectorLabels) }
          { this.renderNanoLabels('template', templateLabels) }
        </S.Editors>
      </Fragment>
    )
  }

  renderNanoLabels(key, actual){
    const bundle = defaults.labelsSection[key];
    const { title, hint } = bundle;
    return(
      <S.Editor>
        { Helper.labelDictToHtml(title, actual, hint) }
      </S.Editor>
    )
  }
}

function LabelCheckRow({checkName, outcome}){
  const outCon = <Micon n={outcome ? 'check' : 'close'}/>;
  const pretty = (defaults.labelChecks[checkName] || {}).title;
  return(
    <tr>
      <td><p>{pretty}</p></td>
      <td>{outCon}</td>
    </tr>
  )
}

export type MatrixBundle = {
  type: 'deployment' | 'service',
  name: string,
  matrix: LabelMatrix
}

type State = {
  labelMatrices: Array<MatrixBundle>
}

const defaultState = (_) => ({
  labelMatrices: [],
  isFetching: true
});

type Props = {
  deployment: Deployment,
}