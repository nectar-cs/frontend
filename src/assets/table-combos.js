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

const SlimTable = styled(Table)`
  tr{
    ${p => p.borderless ? 'border-style: none;' : 'solid'};
    td{
      padding: ${p => (p.space || 1) * 6}px;
    }
  }
`;

const Tables = { Table, SlimTable, ModestHeader };
export default Tables;