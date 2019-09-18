import styled from 'styled-components'

function colored(name, p){
  if(name){
    const color = p.theme.ali(name);
    return p.theme.colors[color];
  } else return p.theme.colors.primaryColor;
}

export const SmallButton = styled.button`
  color: ${p => p.theme.colors.contrastFont};
  background: ${p => colored(p.emotion, p)};
  padding: 7px 11px;
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