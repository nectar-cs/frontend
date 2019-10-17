import S from './DecisionTreeStyles'
import PropTypes from 'prop-types'
import Tree from "react-d3-tree";
import React, {Fragment} from "react";
import Helper from "./Helper";
import defaults from "./defaults";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import Layout from "../../assets/layouts";
import Micon from "../../widgets/Micon/Micon";
import Text from "../../assets/text-combos";

export default class DecisionTree extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      translate: () => {}
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
    const { treeStruct } = this.props;
    const formatted = Helper.structToState(treeStruct);
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
          textLayout={{x: 30, y: 30}}
          depthFactor={80}
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
    treeStruct: PropTypes.shape({
      ask: PropTypes.string,
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
        <Micon n='arrow_right_alt' size="m+" rotate='180'/>
        <Text.P raw pushed> = False</Text.P>
      </Layout.TextLine>
    </S.LegendContainer>
  )
}