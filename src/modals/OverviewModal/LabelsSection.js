//@flow
import type {Deployment, LabelMatrix} from "../../types/Types";
import React, {Fragment} from "react";
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

  genMatrixCells(){
    const { labels, templateLabels, selectorLabels } = this.props.deployment;
    const asHash = { labels, templateLabels, selectorLabels };
    const lengths = Object.keys(asHash).map(k => ({[k]: asHash[k].length}));
    const longest = Math.max(Object.keys(asHash).map(k => k.length));
    const longestBun = lengths.find(l => Object.values(l)[0] === longest);
    const longestKey = Object.keys(longestBun)[0];
    const x = 2;

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

function LabelGrid(matrix: GridData){
  const Rows = matrix.map(row => (
    <GridRow row={row}/>
  ));
  return(
    <Tables.Table>
      <tbody>
        <Rows/>
      </tbody>
    </Tables.Table>
  )
}

function GridRow(row: Array<GridCell>){
  const Content = () => row.map(cell => {
    if(cell){
      return(
        <th key={cell.label} >
          <Text.StatusTag emotion={cell.status}>
            {cell.label}
          </Text.StatusTag>
        </th>
      )
    } else return <th><Micon key={cell.label} n='close'/></th>
  });
  return <tr><Content/></tr>;
}

type GridData = Array<Array<GridCell>>;

type GridCell = {
  label: string,
  status: 'good' | 'warn' | 'bad'
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