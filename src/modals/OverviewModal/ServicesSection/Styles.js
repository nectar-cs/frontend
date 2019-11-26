import styled from 'styled-components'

const InfoIcon = styled.i`
  position: absolute;
  right: 12px;
  bottom: 12px;
  color: ${p => p.theme.colors.primaryColor};
  font-size: 24px;
  &:hover{
    cursor: pointer;
  }
`;

const BoxTitle = styled.p`
  position: absolute;
  background: ${p => p.theme.colors.itemBackgroundColor};
  top: -9px;
  margin-left: 50%;
  padding: 0 14px;
  transform: translateX(-50%);
  font-size: 13px;
`;

const DepBox = styled.div`
  position: relative;
  width: 40%;
  height: 140px;
  border-width: 2px;
  border-color: ${p => p.theme.colors.primaryColor};
  border-style: solid;
  border-radius: 4px;
  display: inline-flex;
`;

const DepBoxHalf = styled.div`
  height: 100%;
  width: 49%;
`;

const DepBoxLine = styled.div`
  height: 100%;
  width: 2%;
`;

const DepBoxSep = styled.div`
  position: absolute;
  width: 1px;
  top: 25px;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${p => p.theme.colors.primaryColor}; 
`;

const S = {
  DepBox,
  BoxTitle,
  DepBoxHalf,
  DepBoxLine,
  DepBoxSep,
  InfoIcon
};
export default S;