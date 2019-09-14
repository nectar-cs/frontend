import styled from "styled-components";

export const InputLine = styled.div`
  height: auto;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: baseline;
  margin-top: 20px;
  justify-content: space-between;
`;

export const LineInput = styled.input`
  width: 100%;
  border-color: ${p => p.theme.colors.primaryColor};
  border-width: 0 0 1px 0;
  padding-left: 0;
  border-radius: 0;
  margin: 0;
  color: ${p => p.theme.colors.primaryFont};
  &:not(:nth-child(1)) {
   margin-left: 18px;
  }
  &::placeholder{
   color: ${p => p.theme.colors.primaryFontLess}
  }
`;

export const LineLabel = styled.p`
  width: 120px;
  min-width: 120px;
`;