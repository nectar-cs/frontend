import styled from 'styled-components'

const Dims = {
  containerPaddingVert: "12px",
  containerPaddingHor: "16px",
};

const ModalLayout = styled.div`
  padding: 14px 20px 14px 20px;
  width: 580px;
  height: 700px;
`;

const ContentContainer = styled.div`
  position: absolute;
  padding: ${Dims.containerPaddingVert} ${Dims.containerPaddingHor};
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  background: ${p => p.theme.colors.contrastColor};
`;

const LeftPanel = styled(ContentContainer)`
  position: absolute;
  width: 48%;
  height: 96%;
  left: 14px;
`;

const RightPanel = styled(LeftPanel)`
  right: 14px;
  left: auto;
  overflow-y: scroll;
`;

const FullWidthPanel = styled(ContentContainer)`
  left: 14px;
  right: 14px;
  min-height: 100%;
`;

const TextLine = styled.div`
  display: flex;
  justify-content: start;
  width: 100%
`;

const BigCodeViewer = styled.div`
  margin-top: 18px;
  padding: 20px 12px;
  border-radius: 4px;
  background: ${p => p.theme.colors.primaryColor};
`;

const Layout = {
  ContentContainer,
  LeftPanel,
  RightPanel,
  TextLine ,
  FullWidthPanel,
  BigCodeViewer,
  ModalLayout,
  Dims
};
export default Layout;