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
        />
      </S.TreeContainer>
    );
  }

  centerTree(){
    const dimensions = this.treeRef.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: S.nodeShape.shapeProps.height
      }
    });
  }

  static propTypes = {
    treeStruct: PropTypes.any.isRequired
  }
}