import styled from 'styled-components'

const Dims = {
  containerPaddingVert: "12px",
  containerPaddingHor: "16px",
};

export const MosaicContainer = styled.div`
  background: ${p => p.theme.colors.contrastColor};
`;

export const StandardLayout = styled(MosaicContainer)`
  padding: 14px 20px 14px 20px;
`;

export const ModalLayout = styled(StandardLayout)`
  width: 580px;
  height: 700px;
`;

export const Intro = styled.p`
  margin-top: 22px;
`;

const ContentContainer = styled(MosaicContainer)`
  position: absolute;
  padding: ${Dims.containerPaddingVert} ${Dims.containerPaddingHor};
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
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
export { Layout };