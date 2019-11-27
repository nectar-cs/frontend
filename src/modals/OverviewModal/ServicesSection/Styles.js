import styled from 'styled-components'
import {colored} from "../../../assets/constants";

const boxWidth = "45%";

const InfoIcon = styled.i`
  position: fixed;
  right: 24px;
  bottom: 24px;
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
  left: 50%;
  padding: 0 11px;
  transform: translateX(-50%);
  font-size: 13px;
  text-align: left;
  font-weight: 900;
`;

const DepBox = styled.div`
  position: relative;
  width: ${boxWidth};
  border-width: 2px;
  border-color: ${p => p.theme.colors.primaryColor};
  border-style: solid;
  border-radius: 4px;
  display: inline-flex;
`;

// noinspection JSUnresolvedFunction
const DepBoxHalf = styled.div`
  height: 100%;
  width: 49%;
  padding: 11px 12px;
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

const DepSvcArrowBox = styled.div`
  height: 80px;
  display: flex;
  position: relative;
`;

const DepSvcArrow = styled.div`
  width: 3px;
  height: 100%;
  margin-left: calc(${boxWidth} / 3);
  background: ${p => p.theme.colors.primaryColor};
`;

const DepSvcArrowTitle = styled.p`
  position:absolute;
  width: auto;
  background: ${p => p.theme.colors.itemBackgroundColor};
  top: 50%;
  left: calc(${boxWidth} / 3 * ${p => p.n});
  padding: 0 11px;
  transform: translateY(-50%) translateX(-50%);
  font-size: 13px;
  font-weight: 900;

`;

const PodsBox = styled.div`
  position: relative;
  width: ${boxWidth};
  border-width: 2px;
  border-color: ${p => p.theme.colors.primaryColor};
  border-style: solid;
  border-radius: 4px;
  padding: 11px 0;
`;

const PodsTop = styled.div`
  height: 100px;
  padding: 0 12px;
`;

const PodsSep = styled.div`
  width: 100%;
  height: 1px;
  margin: 14px auto 8px auto;
  background: ${p => p.theme.colors.primaryColor};
`;

const PodRow = styled.div`
  margin-top: 8px;
  display: flex;  
`;

const PodStatus = styled.div`
  border-radius: 50%;
  width: 14px;
  height: 14px;
  margin-top: 1px;
  margin-right: 10px;
  background: ${p => colored(p.emotion)};
`;

const PodSvcArrowBox = styled.div`
  width: 10%;
  position: relative;
`;

const PodSvcArrow = styled.div`
  height: 3px;
  width: 100%;
  margin-top: 50%;
  background: ${p => p.theme.colors.primaryColor};
`;

const PodSvcArrowTitle = styled.p`
  position:absolute;
  width: auto;
  background: ${p => p.theme.colors.itemBackgroundColor};
  top: ${p => `${25 * p.n}%`};
  margin-left: 50%;
  padding: 0 11px;
  transform: translateX(-50%);
  font-size: 13px;
  text-align: left;
  font-weight: 900;
`;

const ServiceBox = styled.div`
  position: relative;
  width: ${boxWidth};
  border-width: 2px;
  border-color: ${p => p.theme.colors.primaryColor};
  border-style: solid;
  border-radius: 4px;
  padding: 11px 0;
  
`;

// noinspection JSUnresolvedFunction
const LineTwo = styled.div`
  display: flex;
`;

const S = {
  DepBox,
  BoxTitle,
  DepBoxHalf,
  DepBoxLine,
  DepBoxSep,
  InfoIcon,
  DepSvcArrowBox,
  DepSvcArrow,
  PodsBox,
  PodsTop,
  PodsSep,
  PodRow,
  PodStatus,
  PodSvcArrowBox,
  PodSvcArrow,
  ServiceBox,
  LineTwo,
  PodSvcArrowTitle,
  DepSvcArrowTitle,
};
export default S;