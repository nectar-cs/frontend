import styled from 'styled-components'
import { colored } from './../../../assets/constants'
import { Layout as Layouts } from './../../../assets/layouts'

const podSize = "14px";
const mult = 1.04;
const headerSize = "42px";
const headerLeft = "15px";

const Card = styled(Layouts.ContentContainer)`
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

const BottomBox = styled.div`
  position: absolute;
  border-width: 0;
  bottom: 0;
  left: -2px;
  right: 90px;
  display: flex;
  padding: 12px 0 12px 4px;
`;

const PodStatusesBox = styled.div`
  flex-grow: 8;
  display: flex;
`;

const AdditionalControlsBox = styled.div`
  flex-grow: 1;
  width: auto;
  display: flex;
  flex-direction: row-reverse;
`;

const ControlIcon = styled.i`
  font-size: 19px;
  color: ${p => p.theme.colors.contrastLessFont}
`;

const PodCircle = styled.div`
  width: ${podSize};
  height: ${podSize};
  border-radius: 50%;
  margin-left: 6px;
  background: ${p => colored(p.emotion)}; 
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
  BottomBox,
  AdditionalControlsBox,
  ControlIcon
};

export { S };