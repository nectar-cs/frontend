import styled from "styled-components";

export const AppContent = styled.div`
  position: absolute;
  width: auto;
  bottom: 0;
  top: ${p => p.theme.dims.topBarHeight};
  left: ${p => p.theme.dims.sideBarWidth};
  right: 0;
  padding: 12px;
  margin: 0;
`;