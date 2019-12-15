import styled from 'styled-components'

const NsTag = styled.p`
  background: ${p => p.theme.colors.pleasant};
  margin-left: 3px;
  &:nth-child(1){
    margin-left: 0
  }
`;

const S = { NsTag };
export default S;