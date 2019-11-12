import styled from "styled-components";

const InputLine = styled.div`
  height: auto;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: baseline;
  margin-top: 20px;
  justify-content: space-between;
`;

const ContrastInput = styled.input`
  width: 95%;
  border-color: ${p => p.theme.colors.contrastColor};
  border-width: 0 0 1px 0;
  padding-left: 0;
  border-radius: 0;
  color: ${p => p.theme.colors.contrastFont};
  &::placeholder{
    opacity: 1.0;
    color: ${p => p.theme.colors.contrastLessFont}
  }
`;

const LineInput = styled.input`
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

function labelSize(p){
  if(!p || p.size === 'medium') return '120px';
  if(p.size === 'large') return '240px';
  return '100px';
}

const LineLabel = styled.p`
  width: ${p => labelSize(p)};
  min-width: 120px;
`;

const In = {InputLine, LineInput, LineLabel, ContrastInput };
export default In;