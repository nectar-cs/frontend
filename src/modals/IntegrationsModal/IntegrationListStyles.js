import styled from 'styled-components'

const iconSize = '30px';

export const Icon = styled.img`
  width: ${iconSize};
  height: ${iconSize};
`;


export const Trash = styled.i`
  &:hover{
   color: ${p => p.theme.colors.fail}
   cursor: pointer;
  }
`;