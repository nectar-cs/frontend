import React from 'react'
import {Table} from "./ImageReplaceTableStyles";
import PropTypes from 'prop-types'


export default class ImageReplaceTable extends React.Component {
  render(){
    return(
      <Table>
        <tbody>
          <HeaderRow/>
          { this.renderList() }
        </tbody>
      </Table>
    )
  }

  renderList(){
    return this.props.pods.map(pod => {
      return(
        <PodRow key={pod.name} {...pod}/>
      )
    })
  }
}

function PodRow(props){
  return(
    <tr>
      <td><p>{props.name}</p></td>
      <td><p>{props.state}</p></td>
      <td><p>{props.desiredState}</p></td>
      <td><p>{props.imageName}</p></td>
    </tr>
  )
}

function HeaderRow(){
  return(
    <tr>
      <th><p>Name</p></th>
      <th><p>Actual State</p></th>
      <th><p>Desired</p></th>
      <th><p>Image</p></th>
    </tr>
  )
}


/*

  reloadPods(force){
    if(force || this.props.autoUpdate){
      let repeat = () => setTimeout(this.reloadPods, 1000);
      this.fetchPods('updatedPods', repeat)
    }
  }


*/
