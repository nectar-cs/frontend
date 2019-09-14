import styled from "styled-components";

function colored(name, p){
  const color = p.theme.ali(name);
  return p.theme.colors[color];
}

export const StatusTag = styled.p`
  border-radius: 3px;
  padding: 5px 10px;
  text-align: center;
  display: inline-block;
  color: ${p => p.theme.colors.contrastFont};
  font-size: 13px;
  background: ${p => colored(p.emotion, p)};
`;

export const CleanStatus = styled.p`
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${p => p.color || p.theme.colors.primaryColor}
`;

export const BoldStatus = styled(CleanStatus)`
  letter-spacing: 0.2px;
  font-weight: 800;
`;