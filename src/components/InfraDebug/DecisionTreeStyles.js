import styled from 'styled-components'
import {theme} from "../../assets/constants";
import {leaf} from "react-syntax-highlighter/dist/cjs/languages/hljs";

const Container = styled.div`
  position: relative;
  height: 100%;
`;

const TreeContainer = styled.div`
  display: block;
  margin: 30px auto 0 auto;
  height: 100%;
  width: 100%;
`;

const LegendContainer = styled.div`
  position: absolute;
  top: 50px;
  height: 40px;
  width: 120px;
`;

const nodeSide = 27;
const boxDiag = Math.sqrt((nodeSide ** 2) * 2);

function makeNodeShape(color=theme.colors.contrastColor){
  return({...nodeShape,
    shapeProps: { ...nodeShape.shapeProps,
      fill: color
    }
  })
}

function makeLeafShape(color=theme.colors.contrastColor){
  return({...leafShape,
    shapeProps: {...leafShape.shapeProps,
      fill: color
    }
  })
}

const nodeShape = {
  shape: 'rect',
  shapeProps: {
    width: nodeSide,
    height: nodeSide,
    fill: theme.colors.contrastColor,
    stroke: theme.colors.primaryColor,
    strokeWidth: 3,
    transform: "rotate(-45 0 0)",
    x: nodeSide / -2,
    y: nodeSide / -2,
  }
};

const leafShape = {...nodeShape,
  shape: "circle",
  shapeProps: {...nodeShape.shapeProps,
    r: boxDiag / 2.1 - 1,
  }
};

const textBase = {
  font: "normal 15px lato",
  strokeWidth: 0,
  fill: theme.colors.primaryFont,
  x: 100
};

const treeStyles = {
  links: {
    stroke: theme.colors.secondaryColor,
    strokeWidth: 3
  },
  nodes: {
    node: {
      name: textBase
    },
    leafNode: {
      name: textBase
    }
  }
};

const S = {
  nodeSide,
  boxDiag,
  TreeContainer,
  nodeShape,
  leafShape,
  treeStyles,
  LegendContainer,
  Container,
  makeNodeShape,
  makeLeafShape
};

export default S;