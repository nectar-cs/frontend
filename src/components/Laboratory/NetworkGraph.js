import React, {Fragment} from 'react'
import Layout from './../../assets/layouts'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import Graph from "react-graph-vis";
import {theme} from "../../assets/constants";
import {FROM_COUNT, TO_COUNT} from "./NetworkTest";
import ModalButton from "../../widgets/Buttons/ModalButton";
import TextOverLineTitle from "../../widgets/TextOverLineTitle/TextOverLineTitle";

export default class NetworkGraph extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isSuccess: false
    }
  }

  render(){
    return(
      <Layout.LeftPanel>
        { this.renderHeader() }
        { this.renderIntro() }
        { this.renderGraph() }
        { this.renderButton() }
      </Layout.LeftPanel>
    )
  }

  renderButton(){
    return(
      <ModalButton callback={null} title={"Pause Experiment"}/>
    )
  }

  renderIntro(){
    return(
      <Fragment>
        <TextOverLineTitle text="Initial Conditions"/>
        <ul>
          <li>
            <p>From pods: [news-crawl] | [news-listen] </p>
          </li>
          <li>
            <p>From pods: [*nectar] | [*default] </p>
          </li>

        </ul>
      </Fragment>
    )
  }

  renderGraph(){
    const fromNodes = this.fromNodes();
    const toNodes = this.toNodes();
    const edges = this.edges();
    const graph = {
      nodes: fromNodes.concat(toNodes),
      edges: edges
    };

    const options = {
      layout: { hierarchical: false },
      edges: { color: "#000000" }
    };

    return(
      <Fragment>
        <TextOverLineTitle text="Progress"/>
        <Graph
          graph={graph}
          options={options}
          style={{ height: "60%", width: "100%" }}
        />
      </Fragment>

    )
  }

  fromNodes(){
    const color = theme.colors.primaryColor;
    return Array.from(Array(FROM_COUNT).keys()).map(i => (
      { id: i + 1, color }
    ));
  }

  toNodes(){
    const doneColor =  theme.colors.secondaryColor;
    const idleColor =  theme.colors.contentBackgroundColor;
    const offset = FROM_COUNT;
    return Array.from(Array(TO_COUNT).keys()).map(i => {
      const done = this.props.iTo === i;
      const color = done ? doneColor : idleColor;
      return{
        id: offset + i + 1,
        color
      }
    });
  }

  edges(){
    let edges = [];
    for(let i = 0; i < FROM_COUNT; i++){
      const from = i + 1;
      for(let j = 0; j < TO_COUNT; j++){
        const to = FROM_COUNT + j + 1;
        const isCrt = i === this.props.iFrom && j === this.props.iTo;
        const width = isCrt ? 8 : 2;
        edges.push({from, to, width});
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