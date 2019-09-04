import React from 'react'
import {ImageName, Container, Title, Table} from "./PodTableStyles";
import PropTypes from 'prop-types'
import {ModestHeader} from "../../assets/table-combos";
import {Separator} from "../../widgets/Tabs/TabStyles";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";


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
    <td key={i}><p>{mapper(props.pod)}</p></td>
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
    <ModestHeader>
      { fields }
    </ModestHeader>
  )
}