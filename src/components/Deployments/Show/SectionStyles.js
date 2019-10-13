import styled from 'styled-components'
import Layout from "../../../assets/layouts";

const Section = styled(Layout.ContentContainer)`
  padding: ${Layout.Dims.containerPaddingVert} ${Layout.Dims.containerPaddingHor};
  position: static;
  box-shadow: none;
  height: auto;
  width: 100%;
  border-color: ${p => p.chosen ?  p.theme.colors.primaryColor : "transparent"};
  border-width: 2px;
  border-style: solid;
  &:not(:nth-child(1)){
    margin-top: 10px;
  }
`;

const ActivitiesContainer = styled.div`
  margin-left: -20px;
  width: 100%;
  display: inline-flex;
  flex-wrap: wrap;
`;

function activityColor(p){
  const colors = p.theme.colors;
  return p.isChosen ? colors.primaryColor : "transparent";
}

const ActivityContainer = styled.div`
  width: 120px;
  border-color: ${p => activityColor(p)};
  border-radius: 4px;
  border-style: solid;
  border-width: 1.5px;
  margin-left: 20px;
  margin-top: 12px;
  padding: 6px 0 10px 0;
  &:hover{
    border-color: ${p => p.theme.colors.primaryColor};  
  }
`;

const ActivityIcon = styled.i`
  width: 100%;
  text-align: center;
  font-size: 24px;
`;

const ActivityTitle = styled.p`
  text-align: center;
  margin-top: 3px;
`;

const Collapsed = styled(Section)`
  position: relative;
  &:hover{
    border-color: ${p => p.chosen ? p.theme.colors.primaryColor : p.theme.colors.contrastLessFont};
    cursor: pointer;
  }
`;

const LeftBox = styled.div`
  display: inline-flex;
  align-items: center;
  margin-top: 3px;
`;

const CollapsedTitle = styled.p`
  font-size: 15px;
  margin-bottom: 0.5px;
`;

const ToggleArrow = styled.i`
  position: absolute;
  top: 0;
  right: 8px;
  font-size: 28px;
  transform: translateY(50%);
`;

const CollapsedIcon = styled.i`
  color: ${p => p.theme.colors.primaryColor};
  margin-right: 8px;
  font-size: 24px;
`;

const S = {
  Section,
  Collapsed,
  CollapsedIcon,
  ActivitiesContainer,
  ActivityContainer,
  LeftBox,
  CollapsedTitle,
  ToggleArrow,
  ActivityTitle,
  ActivityIcon
};
export default S;