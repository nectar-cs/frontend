import S from './DecisionTreeStyles'
import PropTypes from 'prop-types'
import Tree from "react-d3-tree";
import React from "react";
import Helper from "./Helper";

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
    const { treeStruct } = this.props;
    const formatted = Helper.structToState(treeStruct);
    return(
      <S.TreeContainer ref={r => this.treeRef = r}>
        <Tree
          styles={S.treeStyles}
          nodeSvgShape={S.nodeShape}
          data={formatted}
          orientation='vertical'
          zoomable={false}
          translate={this.state.translate}
          pathFunc='elbow'
          separation={{siblings: 0.8, nonSiblings: 0.9}}
          textLayout={{x: 30, y: 30}}
        />
      </S.TreeContainer>
    );
  }

  centerTree(){
    const dimensions = this.treeRef.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: S.nodeShape.shapeProps.height + 30
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