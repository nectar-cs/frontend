import styled from 'styled-components'
import {Text} from "ui-common";

export const Table = styled.table`
  margin: 20px 0 0 0;
  max-height: 80%;
`;

export const StatusTag = styled(Text.StatusTag)`
  background: ${p => p.theme.colors.pleasant};
  color: ${p => p.theme.colors.contrastFont};
  margin-left: 4px;
  &:nth-child(1){
    margin-left: 0
  }
`;

const S = { Table, StatusTag };
export default S;