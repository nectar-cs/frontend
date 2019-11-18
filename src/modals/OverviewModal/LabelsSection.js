//@flow
import type {Deployment, LabelMatrix} from "../../types/Types";
import React, {Fragment} from "react";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import Text from "../../assets/text-combos";
import Helper from "./Helper";
import Tables from "../../assets/table-combos";
import Micon from "../../widgets/Micon/Micon";

export default class LabelsSection extends React.Component<Props, State>{

  constructor(props) {
    super(props);
    this.state = defaultState(props);
  }

  async componentDidMount(): * {
    const { deployment } = this.props;
    if(deployment){
      const labelMatrices = await Helper.fetchLabelMatrices(deployment);
      this.setState(s => ({...s, labelMatrices}));
    }
  }

  render(){
    const { labelMatrices } = this.state;
    if(labelMatrices.length < 1) return null;

    const Tables = () => labelMatrices.map(m => this.renderTable(m));

    return(
      <Fragment>
        <TextOverLineSubtitle text='Selectors Vs Actual Pod Labels'/>
        <Text.P>
          Deployments and services use selectors to find the pods they care about.
          The tables below summarizes the label interplay.
        </Text.P>
        <Tables/>
      </Fragment>
    )
  }

  genStatuses(bundle: MatrixBundle){
    const { rowNames, colNames } = bundle.matrix;
    return colNames.map(label => rowNames.includes(label));
  }

  renderTable(bundle: MatrixBundle){
    const { rowValues, colNames } = bundle.matrix;

    const statuses = this.genStatuses(bundle);
    const prefix = `${bundle.type} ${bundle.name}'s`;

    const TableRows = () => rowValues.map(rv =>
      <TableRow key={rv[0]} rowValues={rv}/>
    );

    return(
      <Fragment key={bundle.name}>
        <Tables.Table low={2.3}>
          <tbody>
          <TableHeader prefix={prefix} colNames={colNames} statuses={statuses}/>
          <TableRows/>
          </tbody>
        </Tables.Table>
      </Fragment>
    )
  }
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