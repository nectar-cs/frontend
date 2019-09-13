import React from 'react'

function IntegrationItem(props) {
  return(
    <p>{props.type}</p>
  )
}

export default function IntegrationList(props){
  const items = props.items.map(item => (
    <IntegrationItem {...item}/>
  ));

  return(
    <table>
      <tbody>
        { items }
      </tbody>
    </table>
  )
}

