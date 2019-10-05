import styled from 'styled-components'
import { colored } from './../../../assets/constants'
import { S as Layouts } from './../../../assets/layouts'

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

const PodStatusesBox = styled.div`
  position: absolute;
  border-style: solid;
  border-width: 0;
  border-color: #ddd;
  bottom: 0;
  left: -2px;
  right: -2px;
  display: flex;
  padding: 12px 0 12px 4px;
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
  ContentRows
};

export { S };