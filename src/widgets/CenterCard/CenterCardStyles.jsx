import styled from 'styled-components'
import {Layout} from "@nectar/js-common";

const Container = styled(Layout.ContentContainer)`
  position: relative;
  width: ${p => p.size === 'large' ? '60%' : '340px'} ;
  height: ${p => p.size === 'large' ? 'auto' : '340px'} ;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%)
`;

const S = { Container };

export default S;
