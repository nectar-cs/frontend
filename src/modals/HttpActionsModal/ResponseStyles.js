import styled from 'styled-components'

const Holder = styled.div`
  width: 100%;
  max-height: 50%;
  overflow: scroll;
`;

const IHolder = styled.iframe`
  width: 100%;
  max-height: 50%;
  overflow: scroll;
`;

const Code = styled.code`
  white-space: pre;
`;

const S = { Holder, IHolder, Code };

export default S;