import styled from 'styled-components'
import {colored} from "./constants";

function marg(pure){
  return pure ? '17px' : '40px';
}

export const SmallButton = styled.button`
  color: ${p => p.theme.colors.contrastFont};
  background: ${p => colored(p.emotion, p)};
  padding: 7px 11px;
  margin-top: ${p => marg(p.pure)};
`;

const SmallClearButton = styled.button`
  color: ${p => p.theme.colors.primaryFont};
  background: transparent;
  padding: 7px 11px;
  border-width: 1.5px;
  border-style: solid;
  border-color: ${p => p.theme.colors.primaryColor}
  margin-top: ${p => marg(p.pure)};
  &:hover{
    background: ${p => p.theme.secondaryColor};
  }
`;

export const FixedSmallButton = styled(SmallButton)`
  margin: 0;
  width: 80px;
`;

export const BigBottomButtons = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 22px;
  display: flex;
  justify-content: space-evenly;
`;

export const BigButton = styled(SmallButton)`
  width: 40%;
  padding: 0;
  height: 45px;
  font-weight: 900;
`;

const Button = {
  SmallButton,
  FixedSmallButton,
  BigBottomButtons,
  BigButton,
  SmallClearButton
};

export default Button;