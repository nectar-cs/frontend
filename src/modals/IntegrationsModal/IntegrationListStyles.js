import styled from 'styled-components'
import {StatusTag} from "../../assets/text-combos";

const iconSize = '30px';

export const Icon = styled.img`
  width: ${iconSize};
  height: ${iconSize};
`;

export const Identifier = styled.p`
  width: 100px;
`;

export const Status = styled(StatusTag)`
  width: 84px
`;