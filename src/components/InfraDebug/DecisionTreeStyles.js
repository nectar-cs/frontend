import styled from 'styled-components'
import {theme} from "../../assets/constants";

const TreeContainer = styled.div`
  display: block;
  margin: 30px auto 0 auto;
  height: 80%;
  width: 100%;
`;

const nodeSide = 27;

const nodeShape = {
  shape: 'rect',
  shapeProps: {
    width: nodeSide,
    height: nodeSide,
    fill: theme.colors.contrastColor,
    strokeWidth: 3,
    stroke: theme.colors.primaryColor,
    transform: "rotate(-45 0 0)",
    x: nodeSide / -2,
    y: nodeSide / -2,
  }
};

const textBase = {
  font: "normal 16px lato",
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
  TreeContainer,
  nodeShape,
  treeStyles
};

export default S;