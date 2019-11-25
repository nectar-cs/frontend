import styled from 'styled-components'

const CheatSheet = styled.div`
  position: relative;
`;

const ConfigIcon = styled.i`
  width: 100%;
  color: ${p => p.theme.colors.primaryColor};
  font-size: 22px;
  margin: -8px 0 -26px 0;
  text-align: right;
  &:hover{
    cursor: pointer;
  }
`;

const S = { CheatSheet, ConfigIcon };

export default S;