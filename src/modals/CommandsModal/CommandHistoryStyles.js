import styled from 'styled-components';

const Table = styled.table`
  margin-top: -18px;
`;

const Row = styled.tr`
  &:hover {
    background: ${p => p.theme.colors.contentBackgroundColor};
    cursor: pointer;
  }
`;

const S = { Table, Row };
export default S;
