import styled from 'styled-components'

export const MosaicContainer = styled.div`
  background: white;
`;

export const StandardLayout = styled(MosaicContainer)`
  padding: 14px 20px 14px 20px;
`;

export const ModalLayout = styled(StandardLayout)`
  width: 580px;
  height: 700px;
`;

export const LayoutIntro = styled.p`
  margin-top: 22px;
`;

export const Shaded = styled.div`
  display: ${p => p.on ? 'default' : 'none'};
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100000;
  background: rgba(49, 54, 72, 0.8);
`;