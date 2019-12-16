import styled from 'styled-components'

const NsTag = styled.p`
  background: ${p => p.theme.colors.pleasant};
  margin-left: 3px;
  &:nth-child(1){
    margin-left: 0
  }
`;

const bkgColor = p => p.theme.colors.contentBackgroundColor;

const Row = styled.tr`
  background: ${p => p.focused ? bkgColor(p) : 'transparent'};
  &:hover{
    background: ${p => bkgColor(p)};
    cursor: pointer
  }
`;

const S = { NsTag, Row };
export default S;