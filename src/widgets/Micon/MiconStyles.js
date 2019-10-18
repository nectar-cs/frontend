import styled from 'styled-components'
import {colored} from "../../assets/constants";

function size(size){
  if(size === 'm+') return "30px";
  return "22px";
}

const Micon = styled.i`
  font-size: ${p => size(p.size)};
  transform: ${p => p.rotate ? `rotate(${p.rotate}deg)` : "none"};
  color: ${p => colored(p.emotion)}
  ${p => p.extras};
`;

const S = { Micon };

export default S;