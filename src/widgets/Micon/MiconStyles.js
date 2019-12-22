import styled from 'styled-components'
import {colored} from "@nectar/js-common";

function size(size){
  if(size === 'm+') return "30px";
  if(size === 's') return "18px";
  if(size === 'xs') return "14px";
  return "21px";
}

const Micon = styled.i`
  font-size: ${p => size(p.size)};
  transform: ${p => p.rotate ? `rotate(${p.rotate}deg)` : "none"};
  color: ${p => colored(p.emotion)};
  margin-top: ${p => `${(p.top || 0) * 12}px`};
  margin-right: ${p => `${(p.right || 0) * 12}px`};
  margin-bottom: ${p => `${(p.bottom || 0) * 12}px`};
  margin-left: ${p => `${(p.left || 0) * 12}px`};
  ${p => p.hack};
`;

const S = { Micon };

export default S;
