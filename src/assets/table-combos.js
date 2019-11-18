import styled from "styled-components";

const ModestHeader = styled.tr`
  th{
    p {
      font-weight: normal;
    }     
  }
`;

const Table = styled.table`
  margin-top: ${p => p.raw ? 0 : `${(p.low || 1) * 12}px`};
`;

const Tables = { Table, ModestHeader };
export default Tables;