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

    const TableRows = () => rowValues.map(rv =>
      <TableRow key={rv[0]} rowValues={rv}/>
    );

    return(
      <Fragment key={bundle.name}>
        <Text.P>{bundle.type}: {bundle.name}</Text.P>
        <Tables.Table>
          <tbody>
          <TableHeader colNames={colNames} statuses={statuses}/>
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

function TableHeader({colNames, statuses}){
  colNames = ['Label Selectors / Pod Labels', ...colNames];
  const emo = i => i > 0 ? (statuses[i - 1] ? null : 'warn') : null;
  const Cells = () => colNames.map((colName, i) =>
    (<th>{ decide(i, colName, emo(i)) }</th>)
  );
  return <Tables.ModestHeader><Cells/></Tables.ModestHeader>
}

function TableRow({rowValues}){
  const match = (isMatch) => {
    if(isMatch) return <Micon n='check'/>;
    else return <Micon n='close'/>;
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