import styled from 'styled-components';

const Container = styled.div`
  display: inline-flex;
`;

const RowText = styled.p`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover{
    cursor: ${p => (p.clickable ? 'pointer' : 'default')}
    text-decoration: ${p => (p.clickable ? 'underline' : 'none')};
  }
`;

const Icon = styled.i`
  margin-left: 8px;
  margin-top: -2px;
  font-size: 17px;
  color: ${p => p.theme.colors.primaryColor};
`;

const S = { RowText, Container, Icon };
export { S };
