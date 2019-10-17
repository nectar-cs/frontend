import styled from "styled-components";

function activityColor(p){
  const colors = p.theme.colors;
  return p.isChosen ? colors.primaryColor : "transparent";
}

const ActivitiesContainer = styled.div`
  margin-left: -20px;
  width: 100%;
  display: inline-flex;
  flex-wrap: wrap;
`;

const ActivityContainer = styled.div`
  width: 150px;
  border-color: ${p => activityColor(p)};
  border-radius: 4px;
  border-style: solid;
  border-width: 1.5px;
  margin: 12px 0 0 20px;
  padding: 12px 0 10px 0;
  &:hover{
    border-color: ${p => p.theme.colors.primaryColor};
    cursor: pointer;  
  }
`;

const ActivityIcon = styled.i`
  width: 100%;
  text-align: center;
  font-size: 29px;
`;

const ActivityTitle = styled.p`
  text-align: center;
  margin-top: 3px;
`;

const S = {
  ActivitiesContainer,
  ActivityContainer,
  ActivityTitle,
  ActivityIcon
};
export default S;