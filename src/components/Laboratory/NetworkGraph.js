import React, {Fragment} from 'react'
import {S} from './../../assets/layouts'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import Graph from "react-graph-vis";

const FROM_COUNT = 2;
const TO_COUNT = 20;

export default class NetworkGraph extends React.Component {
  render(){
    return(
      <S.LeftPanel>
        { this.renderHeader() }
        { this.renderGraph() }
      </S.LeftPanel>
    )
  }

  renderGraph(){
    const fromNodes = this.fromNodes();
    const toNodes = this.toNodes();
    const edges = this.edges();
    console.log("from");
    console.table(fromNodes);

    console.log("to");
    console.table(toNodes);

    console.log("edges");
    console.table(edges);
    const graph = {
      nodes: fromNodes.concat(toNodes),
      edges: edges
    };

    const options = {
      layout: {
        hierarchical: false
      },
      edges: {
        color: "#000000"
      }
    };

    return(
      <Graph
        graph={graph}
        options={options}
        style={{ height: "100%", width: "100%" }}
      />
    )
  }

  fromNodes(){
    return Array.from(Array(FROM_COUNT).keys()).map(i => (
      { id: i + 1, color: "red" }
    ));
  }

  toNodes(){
    const offset = FROM_COUNT;
    return Array.from(Array(TO_COUNT).keys()).map(i => (
      { id: offset + i + 1, color: i % 2 === 0 ? "black" : "purple" }
    ));
  }

  edges(){
    let edges = [];
    for(let i = 0; i < FROM_COUNT; i++){
      const from = i + 1;
      for(let j = 0; j < TO_COUNT; j++){
        const to = FROM_COUNT + j + 1;
        edges.push({from, to});
      }
    }
    return edges;
  }

  renderHeader(){
    return(
      <LeftHeader
        graphicName='network_check'
        graphicType='icon'
        title='Experiments / Network Policy'
        subtitle='Simulate inter-cluster connections'
      />
    )
  }
}