import S from './DecisionTreeStyles'
import Tree from "react-d3-tree";
import defaults, {nodeShape} from "./defaults";
import React from "react";

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
      <S.TreeContainer ref={r => this.treeRef = r}>
        <Tree
          nodeSvgShape={nodeShape}
          data={defaults.treeData}
          orientation='vertical'
          zoomable={false}
          translate={this.state.translate}
        />
      </S.TreeContainer>
    );
  }

  centerTree(){
    const dimensions = this.treeRef.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: nodeShape.shapeProps.height
      }
    });
  }

}