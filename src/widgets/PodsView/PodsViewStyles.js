import styled from 'styled-components'
import {colored} from "../../assets/constants";

const podSize = 16;
const podMargin = podSize * 0.4;

const Container = styled.div`
  display: inline-flex;
  max-width: 80%;
  padding: 18px 0 8px 0;
`;

const PodCircle = styled.div`
  width: ${podSize}px;
  height: ${podSize}px;
  border-radius: 50%;
  margin-left: ${podMargin}px;
  &:first-child{
    margin-left: 0;
  }
  background: ${p => colored(p.emotion)};
`;

const S = { Container, PodCircle };

export default S;