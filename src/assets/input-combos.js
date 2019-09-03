import styled from "styled-components";

export const InputLine = styled.div`
  height: auto;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: baseline;
  margin-top: 20px;
`;

export const LineInput = styled.input`
  width: 100%;
  border-color: ${p => p.theme.colors.primaryColor};
  border-width: 0 0 1px 0;
  padding-left: 0;
  border-radius: 0;
  margin: 0;
  color: ${p => p.theme.colors.primaryFont};
`;

export const LineTextInput = styled.input`
`.withComponent(LineInput);

export const LineSelect = styled.select`
`.withComponent(LineInput);

export const LineLabel = styled.p`
  width: 30%;
`;