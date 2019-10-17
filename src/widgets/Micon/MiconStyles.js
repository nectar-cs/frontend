import styled from 'styled-components'

function size(size){
  if(size === 'm+') return "30px";
  return "22px";
}

const Micon = styled.i`
  font-size: ${p => size(p.size)};
  color: ${p => p.theme.colors.primaryColor};
  transform: ${p => p.rotate ? `rotate(${p.rotate}deg)` : "none"};
  ${p => p.extras};
`;

const S = { Micon };

export default S;