import React from 'react'
import {Container, Table} from "./PodTableStyles";
import Tables from "../../../assets/table-combos";
import TextOverLineSubtitle from "../../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";


export default class PodTable extends React.Component {
  render(){
    return(
      <Container>
        <TextOverLineSubtitle text='Current Pods'/>
        <Table>
          <tbody>
          <HeaderRow fields={this.props.fields}/>
          { this.renderList() }
          </tbody>
        </Table>
      </Container>
    )
  }

  renderList(){
    return this.props.pods.map(pod => {
      return(
        <PodRow
          key={pod.name}
          pod={pod}
          mappers={this.props.mappers}
        />
      )
    })
  }
}

function PodRow(props){
  const fields = props.mappers.map((mapper, i) => (
    <td key={i}>{mapper(props.pod)}</td>
  ));

  return(
    <tr>
      { fields }
    </tr>
  )
}

function HeaderRow(props){
  const fields = props.fields.map(f => (
    <th key={f}><p>{f}</p></th>
  ));

  return(
    <Tables.ModestHeader>
      { fields }
    </Tables.ModestHeader>
  )
}