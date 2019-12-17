import styled from 'styled-components'
import {Text} from "ui-common/api/styles";

const iconSize = '30px';

export const Icon = styled.img`
  width: ${iconSize};
  height: ${iconSize};
`;

export const Identifier = styled.p`
  width: 100px;
`;

export const Status = styled(Text.StatusTag)`
  width: 84px
`;