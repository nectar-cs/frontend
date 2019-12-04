import styled from 'styled-components';
import { colored } from './constants';

function marg(pure) {
  return pure ? '17px' : '40px';
}

const SmallButton = styled.button`
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

const FixedSmallButton = styled(SmallButton)`
  margin: 0;
  width: 80px;
`;

const BigBottomButtons = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 22px;
  display: flex;
  justify-content: space-evenly;
`;

const BigButton = styled(SmallButton)`
  width: 40%;
  padding: 0;
  height: 45px;
  font-weight: 900;
`;

const FloatingPlus = styled.button`
  z-index: 100;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${p => p.theme.colors.primaryColor};
  font-size: 30px;
  color: white;
  text-align: center;
  position: fixed;
  right: 40px;
  bottom: 40px;
  padding-bottom: 6px;
  box-shadow: 2px 2px 3px #999;
`;

const SpicyButton = styled.button`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 60%;
  background: ${p => p.theme.colors.warn};
  color: ${p => p.theme.colors.contrastColor};
  &:disabled {
    background: ${p => p.theme.colors.disabled};
  }
`;

const Button = {
  FloatingPlus,
  SmallButton,
  FixedSmallButton,
  BigBottomButtons,
  BigButton,
  SmallClearButton,
  SpicyButton,
};

export default Button;
