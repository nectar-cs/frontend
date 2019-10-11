import styled from 'styled-components'
import Layout from "../../../assets/layouts";

const RightPanel = styled(Layout.RightPanel)`
  box-shadow: none;
`;

const LeftPanel = styled(Layout.LeftPanel)`
  position: absolute;
  background: transparent;
  padding: 0;
  flex-direction: column;
  box-shadow: none;
`;

const S = { RightPanel, LeftPanel };
export default S;