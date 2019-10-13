import styled from 'styled-components'

const Micon = styled.i`
  font-size: 22px;
  color: ${p => p.theme.colors.primaryColor};
  ${p => p.extras};
`;

const S = { Micon };

export default S;