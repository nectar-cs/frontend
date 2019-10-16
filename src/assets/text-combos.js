import styled from "styled-components";
import {colored} from "./constants";

const StatusTag = styled.p`
  border-radius: 3px;
  padding: 5px 10px;
  text-align: center;
  display: inline-block;
  color: ${p => p.theme.colors.contrastFont};
  font-size: 13px;
  background: ${p => colored(p.emotion, p)};
`;

const P = styled.p`
  margin-top: 12px;
`;

const A = styled.a`
  text-decoration: none;
  &:hover{
    text-decoration: underline;
    text-decoration-color: ${p => p.theme.colors.contrastFont};  
  }
`;

const PA = styled.p`
  text-decoration: none;
  &:hover{
    text-decoration: underline;
    text-decoration-color: ${p => p.theme.colors.contrastFont};  
  }
`;


const CleanStatus = styled.p`
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${p => p.color || colored(p.emotion, p)}
`;

const BoldStatus = styled(CleanStatus)`
  letter-spacing: 0.2px;
  font-weight: 800;
  color: ${p => colored(p.emotion, p)};
  margin-right: ${p => p.push ? "3px" : '0'}
  margin-left: ${p => p.pushed ? "3px" : '0'}
`;

const Code = styled.code`
  display: block;
  margin-top: ${p => p.chill ? "6px" : "2px"};
  color: ${p => p.theme.colors.contrastFont};
  &:first-child{
    margin-top: 2px;
  }
`;

const ContrastCode = styled(Code)`
  color: ${p => p.theme.colors.primaryFont};
`;

const BoldRef = styled.p`
  text-decoration: underline;
  font-weight: bold;
  margin-right: ${p => p.push ? "3px" : '0'}
  margin-left: ${p => p.pushed ? "3px" : '0'}
`;

const Text = {
  P, A, PA,
  Code,
  BoldStatus,
  CleanStatus,
  StatusTag,
  BoldRef,
  ContrastCode
};

export default Text;