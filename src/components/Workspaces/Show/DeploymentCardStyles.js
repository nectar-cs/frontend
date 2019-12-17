import styled from 'styled-components'
import { Layout, colored } from "ui-common/api/styles"

const podSize = "14px";
const mult = 1.04;
const headerSize = "42px";
const headerLeft = "15px";

const Card = styled(Layout.ContentContainer)`
  position: relative;
  display: inline-block;
  width: calc(360px * ${mult});
  height: calc(260px * ${mult});
  margin-left: 26px;
  margin-top: 16px;
  border: transparent solid 2px;
`;

const Header = styled.div`
  height: ${headerSize};
  width: 100%;
  position: relative;
  margin-bottom: 14px;

`;

const HeaderImage = styled.img`
  position: absolute;
  height: ${headerSize};
  width: ${headerSize};
  display: inline-block;
`;

const HeaderText = styled.p`
  left: ${headerSize};
  position: absolute;
  margin-left: ${headerLeft};
  display: inline-block;
`;

const HeaderTitle = styled(HeaderText)`
  font-size: 16px;
  font-weight: 100;
  margin-top: 1px;
  &:hover{
    text-decoration: underline;
    cursor: pointer;
  }
`;

const HeaderSubtitle = styled(HeaderText)`
  bottom: 1px
`;

const PodStatusesBox = styled.div`
  position: absolute;
  bottom: 0;
  left: -2px;
  right: -2px;
  display: flex;
  padding: 12px 0 12px 4px;`
;

const AdditionalControlsBox = styled.div`
  position: absolute;
  bottom: -4px;
  right: 4px;
  display: inline-flex;
  flex-direction: row-reverse;
  padding: 12px 0 12px 4px;
`;

const ControlIcon = styled.i`
  font-size: 19px;
  margin-left: 7px;
  color: ${p => p.theme.colors.contrastLessFont};
  &:hover{
    color: ${p => p.theme.colors.primaryColor};  
    cursor: pointer;
  }
`;

const PodCircle = styled.div`
  width: ${podSize};
  height: ${podSize};
  border-radius: 50%;
  margin-left: 6px;
  background: ${p => colored(p.emotion)}; 
  &:hover{
    cursor: pointer;
  }
`;

const ContentRows = styled.table`
  margin-top: 18px;
`;

const S = {
  PodStatusesBox,
  PodCircle,
  Card,
  Header,
  HeaderImage,
  HeaderTitle,
  HeaderSubtitle,
  ContentRows,
  AdditionalControlsBox,
  ControlIcon
};

export { S };