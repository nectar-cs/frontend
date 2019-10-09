import styled from "styled-components";

const Trash = styled.i`
  &:hover{
   color: ${p => p.theme.colors.fail}
   cursor: pointer;
  }
`;

const Icon = { Trash };

export default Icon;