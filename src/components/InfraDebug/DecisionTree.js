import S from './DecisionTreeStyles'
import PropTypes from 'prop-types'
import Tree from "react-d3-tree";
import React from "react";
import Helper from "./Helper";
import defaults from "./defaults";
import { Layout, Text, TextOverLineSubtitle } from "@nectar/js-common";
import Micon from "../../widgets/Micon/Micon";

export default class DecisionTree extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      translate: {x: 0, y: 0}
    }
  }

  componentDidMount(){
    this.centerTree()
  }

  render(){
    return(
      <S.Container>
        <TextOverLineSubtitle text={defaults.decisionTree.title}/>
        { this.renderTree() }
        <Legend/>
      </S.Container>
    )
  }

  renderTree(){
    const { semanticTree, crtNodePointer } = this.props;
    const formatted = Helper.structToState2(semanticTree, crtNodePointer, 'top');
    return(
      <S.TreeContainer ref={r => this.treeRef = r}>
        <Tree
          styles={S.treeStyles}
          data={formatted}
          orientation='vertical'
          zoomable={false}
          translate={this.state.translate}
          pathFunc='elbow'
          separation={{siblings: 0.8, nonSiblings: 0.9}}
          depthFactor={80}
          transitionDuration={0}
        />
      </S.TreeContainer>
    );
  }

  centerTree(){
    const dimensions = this.treeRef.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: S.nodeShape.shapeProps.height + 18
      }
    });
  }

  static propTypes = {
    semanticTree: PropTypes.shape({
      positive: PropTypes.any,
      negative: PropTypes.any,
      friendly: PropTypes.string
    })
  }
}

function Legend(){
  return(
    <S.LegendContainer>
      <Layout.TextLine center>
        <Micon n='arrow_right_alt' size="m+"/>
        <Text.P raw pushed> = True</Text.P>
      </Layout.TextLine>
      <Layout.TextLine center>
        <Micon n='arrow_right_alt' size="m+" rotate={180}/>
        <Text.P raw pushed> = False</Text.P>
      </Layout.TextLine>
    </S.LegendContainer>
  )
}
