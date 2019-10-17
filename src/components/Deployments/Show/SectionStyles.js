import styled from 'styled-components'
import Layout from "../../../assets/layouts";

const Section = styled(Layout.ContentContainer)`
  padding: ${Layout.Dims.containerPaddingVert} ${Layout.Dims.containerPaddingHor};
  position: static;
  box-shadow: none;
  height: auto;
  width: 100%;
  border-color: ${p => p.chosen ?  p.theme.colors.primaryColor : "transparent"};
  border-width: 2px;
  border-style: solid;
  &:not(:nth-child(1)){
    margin-top: 10px;
  }
`;

const Collapsed = styled(Section)`
  position: relative;
  &:hover{
    border-color: ${p => p.chosen ? p.theme.colors.primaryColor : p.theme.colors.contrastLessFont};
    cursor: pointer;
  }
`;

const LeftBox = styled.div`
  display: inline-flex;
  align-items: center;
  margin-top: 3px;
`;

const CollapsedTitle = styled.p`
  font-size: 15px;
  margin-bottom: 0.5px;
`;

const ToggleArrow = styled.i`
  position: absolute;
  top: 0;
  right: 8px;
  font-size: 28px;
  transform: translateY(50%);
`;

const CollapsedIcon = styled.i`
  color: ${p => p.theme.colors.primaryColor};
  margin-right: 8px;
  font-size: 24px;
`;

const S = {
  Section,
  Collapsed,
  CollapsedIcon,
  LeftBox,
  CollapsedTitle,
  ToggleArrow,
};
export default S;