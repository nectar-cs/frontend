//@flow
import type {Deployment, LabelMatrix} from "../../types/Types";
import React, {Fragment} from "react";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import Text from "../../assets/text-combos";
import Helper from "./Helper";
import Tables from "../../assets/table-combos";
import Micon from "../../widgets/Micon/Micon";
import S from './Styles'
import defaults from "./defaults";
import Loader from "../../assets/loading-spinner";

export default class LabelsSection extends React.Component<Props, State>{

  constructor(props) {
    super(props);
    this.state = defaultState(props);
  }

  async componentDidMount(): * {
    const { deployment } = this.props;
    if(deployment){
      const labelMatrices = await Helper.fetchLabelMatrices(deployment);
      const labelChecks = await Helper.fetchLabelChecks(deployment);
      this.setState(s => ({...s, labelMatrices, labelChecks}));
    }
  }

  render(){
    return(
      <Fragment>
        <TextOverLineSubtitle text='Everything Labels'/>
        { this.renderDiffTables() }
        { this.renderLabelChecks() }
        { this.renderCompTables() }
      </Fragment>
    )
  }

  genStatuses(bundle: MatrixBundle){
    const { rowNames, colNames } = bundle.matrix;
    return colNames.map(label => rowNames.includes(label));
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
        <Text.P low={1.7}>A deployment defines <b>three sets</b> of labels:</Text.P>
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

  renderCompTables(){
    const { labelMatrices } = this.state;
    if(labelMatrices.length < 1) return null;

    const CompTables = () => labelMatrices.map(m => this.renderCompTable(m));
    return(
      <Fragment>
        <CompTables/>
      </Fragment>
    )
  }

  renderCompTable(bundle: MatrixBundle){
    const { rowValues, colNames } = bundle.matrix;

    const statuses = this.genStatuses(bundle);
    const prefix = `${bundle.type} ${bundle.name}'s`;

    const TableRows = () => rowValues.map(rv =>
      <TableRow key={rv[0]} rowValues={rv}/>
    );

    return(
      <Fragment key={bundle.name}>
        <Tables.Table low={1.0}>
          <tbody>
          <TableHeader prefix={prefix} colNames={colNames} statuses={statuses}/>
          <TableRows/>
          </tbody>
        </Tables.Table>
      </Fragment>
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

function Label({value, emotion}) {
  return(
    <Text.StatusTag emotion={emotion}>
      { value }
    </Text.StatusTag>
  )
}

function decide(i, value, emotion){
  if(i === 0) return <p><b>{value}</b></p>;
  else return <Label value={value} emotion={emotion}/>
}

function TableHeader({colNames, statuses, prefix}){
  colNames = ['Selectors / Pod Labels', ...colNames];
  const emo = i => i > 0 ? (statuses[i - 1] ? null : 'warn') : null;
  const pre = (i, str) => i === 0 ? `${prefix} ${str}` : str;
  const Cells = () => colNames.map((colName, i) =>
    (<th>{ decide(i, pre(i, colName), emo(i)) }</th>)
  );
  return <Tables.ModestHeader><Cells/></Tables.ModestHeader>
}

function TableRow({rowValues}){
  const match = (isMatch) => {
    const iconName = isMatch ? 'check' : 'close';
    return <Micon n={iconName} e={{marginLeft: '22px'}}/>;
  };

  const Cells = () => rowValues.map((rowValue, i) => {
    const isRowHeader = i === 0;
    const val = isRowHeader ? <Label value={rowValue} /> : match(rowValue);
    return <td>{val}</td>
  });

  return <tr><Cells/></tr>
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
  labelMatrices: []
});

type Props = {
  deployment: Deployment,
}