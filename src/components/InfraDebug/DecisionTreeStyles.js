import styled from 'styled-components'
import {theme} from "../../assets/constants";

const TreeContainer = styled.div`
  display: block;
  margin: 30px auto 0 auto;
  height: 80%;
  width: 100%;
`;

const nodeShape = {
  shape: 'rect',
  shapeProps: {
    width: 30,
    height: 30,
    stroke: "red",
    transform: "rotate(-45 0 0)",
    x: -15,
    y: -15,
  }
};

const treeStyles = {
  links: {
    stroke: theme.colors.secondaryColor,
    strokeWidth: 3
  },
  nodes: {
    node: {
      name: {
        color: 'red',
        marginLeft: "19px"
      }
    }
  }
};

const S = {
  TreeContainer,
  nodeShape,
  treeStyles
};

export default S;